"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React from "react";

function UpgradeButton() {
  const { mutate: createStripeSession, isPending } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url && typeof window !== "undefined") {
          window.location.href = url;
        } else if (typeof window !== "undefined") {
          window.location.href = "/dashboard/billing";
        }
      },
    });
  return (
    <Button
      onClick={() => createStripeSession()}
      className="w-full"
      disabled={isPending}
    >
      {isPending ? (
        "Redirecting..."
      ) : (
        <>
          Upgrade Now <ArrowRight className="h-4 w-4 ml-1.5" />
        </>
      )}
    </Button>
  );
}

export default UpgradeButton;
