"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon, SendIcon } from "lucide-react";
import { useContext, useRef } from "react";
import { ChatContext } from "./chat-context";

type Props = {
  isDisabled?: boolean;
};

function ChatInput({ isDisabled }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { addMessage, message, handleInputChange, isLoading } =
    useContext(ChatContext);
  return (
    <div className="absolute bottom-0 left-0 w-full">
      <div className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto max-w-2xl xl:max-w-3xl">
        <div className="relative flex flex-1 h-full items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textAreaRef}
                onChange={handleInputChange}
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addMessage();
                    textAreaRef.current?.focus();
                  }
                }}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-blue
                scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
                autoFocus
                placeholder="Enter your Question..."
                rows={1}
                maxRows={4}
              />
              <Button
                disabled={isLoading || isDisabled}
                size={"sm"}
                className="absolute bottom-1 right-[8px]"
                variant={"default"}
                onClick={() => {
                  addMessage();
                  textAreaRef.current?.focus();
                }}
              >
                {!isLoading ? (
                  <SendIcon className="h4 w-4" />
                ) : (
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
