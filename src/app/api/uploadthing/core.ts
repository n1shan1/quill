import { db } from "@/app/db";
import { PLANS } from "@/config/stripe";
import { createGeminiEmbeddings } from "@/lib/gemini-embeddings";
import { pinecone } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

const middleWare = async () => {
  const { getUser } = getKindeServerSession();
  const users = await getUser();
  if (!users || !users.id) {
    throw new UploadThingError("Unauthorized");
  }
  const subscriptionPlan = await getUserSubscriptionPlan();
  return { userId: users.id, subscriptionPlan };
};
const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleWare>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  const isFileExists = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExists) return;

  const fileInserted = await db.file.create({
    data: {
      key: file.key,
      name: file.name,
      url: `https://w9yz545733.ufs.sh/f/${file.key}`,
      userId: metadata.userId,
      uploadStatus: "PROCESSING",
    },
  });
  try {
    const response = await fetch(`https://w9yz545733.ufs.sh/f/${file.key}`);
    const blobObject = await response.blob();
    const loader = new PDFLoader(blobObject);
    const pageLevelDocs = await loader.load();
    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;
    const pageAmount = pageLevelDocs.length; //*WIP
    const isProExceeded =
      pageAmount > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPdf;
    const isFreeExceeded =
      pageAmount > PLANS.find((plan) => plan.name === "Free")!.pagesPerPdf;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await db.file.update({
        data: {
          uploadStatus: "FAILED",
        },
        where: {
          id: fileInserted.id,
        },
      });
    }
    //vectorize the document
    const pineconeIndex = pinecone?.Index?.("quill");
    if (!pineconeIndex) {
      throw new Error("Pinecone index is not properly initialized.");
    }
    const embeddings = createGeminiEmbeddings({
      apiKey: process.env.GEMINI_API_KEY!,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      namespace: fileInserted.id,
    });
    await db.file.update({
      where: {
        id: fileInserted.id,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (error) {
    console.log(error);
    await db.file.update({
      where: {
        id: fileInserted.id,
      },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }
};
export const ourFileRouter = {
  freePlanUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(middleWare)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({
    pdf: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(middleWare)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
