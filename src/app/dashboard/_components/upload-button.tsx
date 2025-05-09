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

  const { startUpload } = useUploadThing("pdfUploader");

  const { mutate: startPolling } = trpc.getFile.useMutation({
    onSuccess: (file) => {
      router.push(`/dashboard/${file.id}`);
      toast.success("File Uploaded successfully.");
    },
    onError: (error) => {
      console.log(error);
      toast.error("There was an issue uploading the file.");
    },
    retry: true,
    retryDelay: 500,
  });
  //progress bar simulation
  const startSimulatedProgress = () => {
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
  return (
    <Dropzone
      multiple={false}
      onDrop={async (acceptedFiles) => {
        try {
          setIsUploading(true);
          const progressInterval = startSimulatedProgress();

          //handle the upload
          const res = await startUpload(acceptedFiles);

          if (!res) {
            toast.error("There was an error uploading the file");
          }

          const [fileResponse] = res!;
          const key = fileResponse?.key;

          if (!key) {
            toast.error("There was an error uploading the file");
          }

          clearInterval(progressInterval);
          setIsUploading(false);
          startPolling({ key });
        } catch (error) {
          console.log(error);
        }
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => {
        return (
          <div
            {...getRootProps()}
            className="border h-64 m-4 border-dashed border-foreground/30 rounded-lg"
          >
            <div className="flex items-center justify-center h-full w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-foreground/10 hover:bg-foreground/20"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <CloudUpload className="h-12 w-12 stroke-muted-foreground/70" />
                  <p className="mb-2 text-sm text-muted-foreground.50 text-center">
                    <span className="font-semibold">Click to Upload</span>
                    <br />
                    or drag and drop the file.
                  </p>
                  <p className="text-xs 'text-muted-foreground">
                    Allowed PDF&apos;s upto {"4MB"} only.
                  </p>
                </div>
                {acceptedFiles && acceptedFiles[0] ? (
                  <div className="max-w-xs bg-white flex items-center rounded-md overflow-hidden outline outline-[1px] outline-foreground/20 divide-x divide-muted-foreground/40">
                    <div className="px-3 py-2 h-full grid place-items-center">
                      <FileIcon className="h-4 w-4" />
                    </div>
                    <div className="px-3 py-2 h-full text-sm truncate">
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
                        <Loader2Icon className="h-4 2-4 animate-spin" />
                        Redirecting...
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <input
                  {...getInputProps()}
                  type="file"
                  id="dropzone-file"
                  className="hidden"
                />
              </label>
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
};

type Props = {};

function UploadButton({}: Props) {
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
