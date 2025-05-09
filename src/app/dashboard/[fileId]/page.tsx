import { db } from "@/app/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";
import PdfRenderer from "../_components/pdf-renderer";
import ChatWrapper from "../_components/chat/chat-wrapper";

interface PageProps {
  params: {
    fileId: string;
  };
}
async function FilePage({ params }: PageProps) {
  const { fileId } = params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) redirect(`/auth-callback?origin=dashboard/${fileId}`);

  const file = await db.file.findUnique({
    where: {
      userId: user.id,
      id: fileId,
    },
  });
  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow flex flex-col md:flex-row xl:px-2">
        {/* PDF viewer section - full width on mobile, flex-1 on larger screens */}
        <div className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:pl-6">
            <PdfRenderer fileUrl={file.url ?? ""} />
          </div>
        </div>

        {/* Chat section - full width on mobile, placed below PDF */}
        <div className="border-t border-foreground/40 md:shrink-0 md:flex-[0.75] md:border-l md:border-t-0 lg:w-96">
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
}

export default FilePage;
