import { cn } from "@/lib/utils";
import { ExtendMessage } from "@/types/message";
import React, { forwardRef } from "react";
import { Icons } from "../icons/icons";
import ReactMarkDown from "react-markdown";
import { format } from "date-fns";
type Props = {
  message: ExtendMessage;
  isNextMessageSamePerson: boolean;
};

const MessageBox = forwardRef<HTMLDivElement, Props>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-end gap-2",
          message.isUserMessage ? "justify-end" : "justify-start"
        )}
      >
        {/* Avatar/Icon */}
        <div
          className={cn(
            "relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card shadow-sm transition-colors",
            {
              "order-2": message.isUserMessage,
              "order-1": !message.isUserMessage,
              invisible: isNextMessageSamePerson,
              "bg-primary/80": message.isUserMessage,
              "bg-muted": !message.isUserMessage,
            }
          )}
          style={{
            background: message.isUserMessage
              ? "hsl(var(--primary) / 0.8)"
              : "hsl(var(--muted))",
            borderColor: "hsl(var(--border))",
          }}
        >
          {message.isUserMessage ? (
            <Icons.user className="fill-zinc-200 text-zinc-300 h-6 w-6" />
          ) : (
            <Icons.logo className="fill-zinc-400 h-6 w-6" />
          )}
        </div>
        {/* Message bubble */}
        <div
          className={cn(
            "flex flex-col space-y-1 max-w-md",
            message.isUserMessage ? "items-end order-1" : "items-start order-2"
          )}
        >
          <div
            className={cn(
              "px-4 py-2 rounded-lg inline-block text-sm shadow transition-colors border",
              message.isUserMessage
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-muted",
              {
                "rounded-br-none":
                  !isNextMessageSamePerson && message.isUserMessage,
                "rounded-bl-none":
                  !isNextMessageSamePerson && !message.isUserMessage,
              }
            )}
            style={{
              background: message.isUserMessage
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
              color: message.isUserMessage
                ? "hsl(var(--primary-foreground))"
                : "hsl(var(--muted-foreground))",
              borderColor: message.isUserMessage
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
            }}
          >
            {typeof message.text === "string" ? (
              <ReactMarkDown
                components={{
                  p: ({ node, ...props }) => (
                    <p
                      {...props}
                      className={cn("prose prose-sm break-words", {
                        "text-primary-foreground": message.isUserMessage,
                        "text-muted-foreground": !message.isUserMessage,
                      })}
                      style={{
                        color: message.isUserMessage
                          ? "hsl(var(--primary-foreground))"
                          : "hsl(var(--muted-foreground))",
                      }}
                    />
                  ),
                }}
              >
                {message.text}
              </ReactMarkDown>
            ) : (
              message.text
            )}
            {message.id !== "loading-message" ? (
              <div
                className={cn(
                  "text-xs select-none mt-1 w-full text-right opacity-70",
                  {
                    "text-muted-foreground": !message.isUserMessage,
                    "text-primary-foreground": message.isUserMessage,
                  }
                )}
                style={{
                  color: message.isUserMessage
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--muted-foreground))",
                }}
              >
                {format(new Date(message.createdAt), "HH:mm")}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
);

export default MessageBox;
