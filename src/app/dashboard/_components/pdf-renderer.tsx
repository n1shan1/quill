import React from "react";

type Props = {};

function PdfRenderer({}: Props) {
  return (
    <div className="w-full bg-background rounded-md flex flex-col items-center shadow-md">
      <div className="h-14 w-full border-b border-foreground/30 items-center justify-between px-2">
        <div className="flex items-center gap-1.5">top bar</div>
      </div>
    </div>
  );
}

export default PdfRenderer;
