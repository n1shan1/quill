import React from "react";
import Messages from "./messages";
import ChatInput from "./chat-input";

type Props = {};

function ChatWrapper({}: Props) {
  return (
    <div className="relative min-h-full bg-muted-foreground/50 flex divide-y divide-foreground/40 flex-col justify-between">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatWrapper;
