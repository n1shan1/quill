"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Loader,
  Loader2,
  Loader2Icon,
  RotateCcw,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useResizeDetector } from "react-resize-detector";
import { toast } from "sonner";
import { z } from "zod";

import SimpleBar from "simplebar-react";
import PdfFullScreen from "./pdf-fullscreen";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
type Props = {
  fileUrl: string;
};
function PdfRenderer({ fileUrl }: Props) {
  const { ref, width } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const isLoading = renderedScale !== scale;

  const inputSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  type TCustomPageValidator = z.infer<typeof inputSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(inputSchema),
  });

  const handlePageSubmit = (page: TCustomPageValidator) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };
  return (
    <div className="w-full bg-background rounded-md flex flex-col items-center shadow-md">
      <div className="h-14 w-full border-b border-foreground/30 items-center justify-between p-2">
        <div className="flex items-center gap-1.5 justify-between">
          <div className="flex gap-2 items-center justify-between">
            <TooltipProvider delayDuration={3}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={numPages === undefined || currPage === numPages}
                    onClick={() =>
                      setCurrPage((prevPage) =>
                        prevPage + 1 > numPages! ? numPages! - 1 : numPages!
                      )
                    }
                    aria-label="previous-page"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Next Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex items-center gap-1.5">
              <Input
                value={currPage}
                {...register("page")}
                className={cn(
                  "h-8 w-8",
                  errors.page ? "focus-visible:ring-red-500" : ""
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit(handlePageSubmit)();
                  }
                }}
              />
              <span className="">/</span>
              <span>
                {numPages ?? <Loader className="h-4 w-4 animate-spin" />}
              </span>
            </div>
            <TooltipProvider delayDuration={3}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={numPages === undefined || currPage <= 1}
                    onClick={() =>
                      setCurrPage((prevPage) =>
                        prevPage - 1 > 1 ? prevPage - 1 : 1
                      )
                    }
                    aria-label="previous-page"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Previous Page</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="gap-1.5"
                  aria-label="icon-zoom"
                >
                  <Search className="h-4 w-4" />
                  {scale * 100}%<ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setScale(1)}>
                  <p>100%</p>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.25)}>
                  <p>125%</p>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(1.5)}>
                  <p>150%</p>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setScale(2)}>
                  <p>200%</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <TooltipProvider delayDuration={3}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setRotation((prev) => prev + 90)}
                    aria-label="hi bruh!"
                    variant={"ghost"}
                    size={"sm"}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Rotate</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PdfFullScreen fileUrl={fileUrl} />
          </div>
        </div>
      </div>
      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className="max-h-[calc(100vh-10rem)]">
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
              {isLoading && renderedScale ? (
                <Page
                  key={"@" + renderedScale}
                  rotate={rotation}
                  scale={scale}
                  width={width ?? 1}
                  pageNumber={currPage}
                />
              ) : null}
              <Page
                onRenderSuccess={() => setRenderedScale(scale)}
                className={cn(isLoading ? "hidden" : "")}
                rotate={rotation}
                scale={scale}
                key={"@" + scale}
                width={width ?? 1}
                pageNumber={currPage}
                loading={
                  <div className="flex justify-center">
                    <Loader2Icon className="my-24 h-12 w-12 animate-spin" />
                  </div>
                }
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}

export default PdfRenderer;
