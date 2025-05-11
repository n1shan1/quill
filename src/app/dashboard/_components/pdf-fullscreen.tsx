import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Expand, Loader2 } from "lucide-react";
import { useState } from "react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import SimpleBar from "simplebar-react";
import { toast } from "sonner";

type Props = {
  fileUrl: string;
};

function PdfFullScreen({ fileUrl }: Props) {
  const [open, setOpen] = useState(false);
  const { ref, width } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant={"ghost"}
          className="gap-1.5"
          size={"sm"}
        >
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)] mt-6">
          <div className="" ref={ref}>
            <Document
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              onLoadError={() => {
                toast.error(
                  "Cannot fetch the PDF, please refresh the page, if the issue persists, reupload."
                );
              }}
              loading={
                <div
                  className="flex flex-col justify-center h-screen items-center
          "
                >
                  <Loader2 className="h-12 w-12 animate-spin" />
                  Loading Document, please wait.
                </div>
              }
              file={fileUrl}
              className={"max-h-full"}
            >
              {new Array(numPages).fill(0).map((_, index) => (
                <Page key={index} width={width ?? 1} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
}

export default PdfFullScreen;
