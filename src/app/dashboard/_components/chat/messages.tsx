"use client";
import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import MessageBox from "./message-box";
import { ChatContext } from "./chat-context";
import { useIntersection } from "@mantine/hooks";
type MessagesProps = {
  fileId: string;
};

function Messages({ fileId }: MessagesProps) {
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const { isLoading: isAiThinking } = useContext(ChatContext);
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        placeholderData: (prev) => prev,
      }
    );
  const messages = data?.pages.flatMap((page) => page.messages) ?? [];
  const { entry, ref } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const loadingMessage = {
    id: "loading",
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
    createdAt: new Date(),
    isUserMessage: false,
  };

  const combineMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-foreground/40 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combineMessages && combineMessages.length > 0 ? (
        combineMessages.map((message, i) => {
          const isNextMessageSamePerson =
            i > 0 &&
            combineMessages[i - 1]?.isUserMessage ===
              combineMessages[i].isUserMessage;
          if (i === combineMessages.length - 1) {
            return (
              <MessageBox
                ref={ref}
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={{
                  ...message,
                  createdAt: message.createdAt.toString(),
                }}
              />
            );
          } else {
            return (
              <MessageBox
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={{
                  ...message,
                  createdAt: message.createdAt.toString(),
                }}
              />
            );
          }
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-foreground/90" />
          <h3 className="font-semibold text-xl">
            You&apos;re ready to chat with your PDF.
          </h3>
          <p className="text-muted-foreground">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
}

export default Messages;
