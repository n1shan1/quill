"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { trpc } from "../_trpc/client";
import { Loader } from "lucide-react";

const AuthCallbackContent = () => {
  const router = useRouter();
  const params = useSearchParams();
  const origin = params.get("origin");

  const { data, error } = trpc.authCallback.useQuery(undefined, {
    retry: true,
  });

  React.useEffect(() => {
    if (data) {
      router.push(origin ? `/${origin}` : "/dashboard");
    } else if (error) {
      if (error.data?.code === "UNAUTHORIZED") {
        router.push("/sign-in");
      }
    }
  }, [data, error, origin, router]);

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader className={"h-10 w-10 animate-spin"} />
        <h3 className="text-muted-foreground text-2xl font-semibold">
          Setting up your account...
        </h3>
        <p className="text-sm text-foreground">
          You will be redirected automatically!
        </p>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full mt-24 flex justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className={"h-10 w-10 animate-spin"} />
            <h3 className="text-muted-foreground text-2xl font-semibold">
              Loading...
            </h3>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
};

export default Page;
