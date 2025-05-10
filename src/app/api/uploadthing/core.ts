import { db } from "@/app/db";
import { createGeminiEmbeddings } from "@/lib/gemini-embeddings";
import { pinecone } from "@/lib/pinecone";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { PineconeStore } from "@langchain/pinecone";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const users = await getUser();
      if (!users || !users.id) {
        throw new UploadThingError("Unauthorized");
      }

      return { userId: users.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
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
        const pageAmount = pageLevelDocs.length; //*WIP

        //vectorize the document
        const pineconeIndex = pinecone.Index("quill");
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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
