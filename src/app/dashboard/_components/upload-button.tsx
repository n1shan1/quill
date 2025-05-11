"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/upload-thing";
import { CloudUpload, FileIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

const UploadDropzone = () => {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState<boolean | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
      toast.success("File Uploaded successfully.");
    },
    onError: (error) => {
      console.error(error);
      setError("There was an issue uploading the file.");
      toast.error("There was an issue uploading the file.");
    },
    retry: true,
    retryDelay: 500,
  });

  const startSimulatedProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + 5;
      });
    }, 500);
    return interval;
  };

  const handleFileUpload = async (acceptedFiles: File[]) => {
    try {
      setError(null);
      setIsUploading(true);
      const progressInterval = startSimulatedProgress();

      if (!acceptedFiles || acceptedFiles.length === 0) {
        throw new Error("No file selected");
      }

      const file = acceptedFiles[0];
      if (file.size > 4 * 1024 * 1024) {
        // 4MB limit
        throw new Error("File size exceeds 4MB limit");
      }

      if (file.type !== "application/pdf") {
        throw new Error("Only PDF files are allowed");
      }

      const res = await startUpload(acceptedFiles);

      if (!res) {
        throw new Error("Upload failed");
      }

      const [fileResponse] = res;
      const key = fileResponse?.key;

      if (!key) {
        throw new Error("Invalid file response");
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      startPolling({ key });
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Upload failed");
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setIsUploading(false);
    }
  };

  return (
    <Dropzone
      multiple={false}
      accept={{
        "application/pdf": [".pdf"],
      }}
      onDrop={handleFileUpload}
    >
      {({ getRootProps, getInputProps, acceptedFiles, isDragActive }) => (
        <div
          {...getRootProps()}
          className={`border h-64 m-4 border-dashed border-foreground/30 rounded-lg transition-colors ${isDragActive ? "bg-foreground/20" : "bg-foreground/10"
            }`}
        >
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudUpload className="h-12 w-12 stroke-muted-foreground/70" />
                <p className="mb-2 text-sm text-muted-foreground/50 text-center">
                  <span className="font-semibold">Click to Upload</span>
                  <br />
                  or drag and drop the file.
                </p>
                <p className="text-xs text-muted-foreground">
                  Allowed PDF&apos;s upto {"4MB"} only.
                </p>
                {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              </div>

              {acceptedFiles && acceptedFiles[0] ? (
                <div className="max-w-xs bg-background flex items-center rounded-md overflow-hidden outline outline-[1px] outline-foreground/20 divide-x divide-muted-foreground/40">
                  <div className="px-3 py-2 h-full grid place-items-center">
                    <FileIcon className="h-4 w-4" />
                  </div>
                  <div className="px-3 py-2 h-full text-sm truncate text-foreground/50">
                    {acceptedFiles[0].name}
                  </div>
                </div>
              ) : null}

              {isUploading ? (
                <div className="w-full mt-4 max-w-xs mx-auto">
                  <Progress
                    indicatorColor={
                      uploadProgress === 100 ? "bg-green-500" : ""
                    }
                    className="h-1 w-full bg-muted-foreground/50"
                    value={uploadProgress}
                  />
                  {uploadProgress === 100 ? (
                    <div className="flex gap-1 items-center justify-center text-sm text-muted-foreground/50 text-center pt-2">
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                      Redirecting...
                    </div>
                  ) : null}
                </div>
              ) : null}
              <input
                {...getInputProps()}
                type="file"
                accept=".pdf"
                className="hidden"
              />
            </div>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

function UploadButton() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog
      onOpenChange={(v) => {
        if (!v) {
          setOpen(v);
        }
      }}
      open={open}
    >
      <DialogTrigger onClick={() => setOpen(true)} asChild>
        <Button variant={"default"}>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Upload the PDF to chat with!</DialogTitle>{" "}
        </DialogHeader>
        <UploadDropzone />
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
