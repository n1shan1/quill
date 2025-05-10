"use client";
import React from "react";
import Messages from "./messages";
import ChatInput from "./chat-input";

import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatContextProvider } from "./chat-context";
type Props = {
  fileId: string;
};

function ChatWrapper({ fileId }: Props) {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data.state.data?.fileStatus === "SUCCESS" ||
          data.state.data?.fileStatus === "FAILED"
          ? false
          : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-full bg-background flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <h3 className="font-semibold text-2xl">Loading...</h3>
          <p className="text-foreground text-sm">
            We&apos;re preparing your PDF.
          </p>
        </div>
      </div>
    );
  }

  if (data?.fileStatus === "PROCESSING") {
    return (
      <div className="relative min-h-full bg-background flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <h3 className="font-semibold text-2xl">Processing PDF...</h3>
          <p className="text-muted-foreground text-sm text-center">
            We&apos;re processing your PDF. <br /> This wont take long.
          </p>
        </div>
      </div>
    );
  }

  if (data?.fileStatus === "FAILED") {
    return (
      <div className="relative min-h-full bg-background flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col items-center gap-2">
          <XCircle className="h-8 w-8 text-red-500" />
          <h3 className="font-semibold text-2xl">Too many pages in PDF!</h3>
          <p className="text-muted-foreground text-sm text-center">
            Your <span className="font-bold">FREE</span> plan supports only{" "}
            <span className="font-bold">5 {""}</span>
            pages per PDF
          </p>
        </div>
        <Link
          href={"/dashboard"}
          className={cn(buttonVariants({ variant: "secondary" }), "mt-4")}
        >
          <ChevronLeft className="h-3 w-3 mr-1.5" />
          Back to Home
        </Link>
      </div>
    );
  }
  return (
    <ChatContextProvider fileId={fileId}>
      <div className="relative min-h-full flex divide-y divide-foreground/30 flex-col justify-between">
        <div className="flex-1 justify-between flex flex-col mb-28">
          <Messages fileId={fileId} />
        </div>
        <ChatInput fileId={fileId} />
      </div>
    </ChatContextProvider>
  );
}

export default ChatWrapper;
