"use client";
import { trpc } from "@/app/_trpc/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Ghost, Loader2Icon, MessageSquare, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import UploadButton from "./upload-button";

type Props = {};

function Dashboard({}: Props) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);
  const { data: files, isLoading, refetch } = trpc.getUserFiles.useQuery();

  const { mutate, isPending } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      toast.success("File deleted successfully");
      refetch();
      setDeletingFileId(null);
    },
    onError: () => {
      toast.error("Failed to delete file. Please try again.");
      setDeletingFileId(null);
    },
  });

  const handleDeleteFile = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      setDeletingFileId(id);
      mutate({ id });
    }
  };

  return (
    <main className="mx-auto max-w-7xl md:p-10 p-4">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-muted-foreground/40 border-b pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-muted-foreground">
          My Files
        </h1>
        <UploadButton />
      </div>

      {files && files?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-foreground/20 md:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-foreground/10 rounded-lg bg-background shadow transition hover:shadow-lg"
              >
                <Card>
                  <CardContent className="flex items-center justify-between py-4">
                    <p className="font-semibold">{file.name}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center justify-between gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4 stroke-muted-foreground" />
                        20
                      </span>
                      <div className="h-[15px] w-[2px] bg-foreground/20" />
                      <p className="text-muted-foreground text-sm">
                        {format(new Date(file.createdAt), "MMM yyyy")}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/${file.id}`}
                      className={cn(
                        buttonVariants({
                          variant: "outline",
                          size: "sm",
                        }),
                        "cursor-pointer"
                      )}
                    >
                      Open Document
                    </Link>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => handleDeleteFile(file.id)}
                            variant={"ghost"}
                            type="button"
                            size={"icon"}
                            disabled={isPending && deletingFileId === file.id}
                          >
                            {isPending && deletingFileId === file.id ? (
                              <Loader2Icon className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2Icon className="h-3 w-3" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Delete Document</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
            <Skeleton
              className="h-40 rounded-lg bg-foreground/10"
              key={index}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8" />
          <h3 className="font-semibold text-xl">Pretty empty around here.</h3>
          <p className="text-sm text-muted-foreground">
            Let&apos;s upload your first PDF
          </p>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
