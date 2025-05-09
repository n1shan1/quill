import { db } from "@/app/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
