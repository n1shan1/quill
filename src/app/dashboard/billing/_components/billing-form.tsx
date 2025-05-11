"use client";

import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/app/components/global/max-width-wrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { format } from "date-fns";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

interface BillingFormProps {
  subscriptionPlan: Awaited<ReturnType<typeof getUserSubscriptionPlan>>;
}

const BillingForm = ({ subscriptionPlan }: BillingFormProps) => {
  const { mutate: createStripeSession, isPending } =
    trpc.createStripeSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) window.location.href = url;
        if (!url) {
          toast.error("There was a problem fulfilling your request!");
        }
      },
    });

  return (
    <MaxWidthWrapper className="max-w-5xl">
      <form
        className="mt-12"
        onSubmit={(e) => {
          e.preventDefault();
          createStripeSession();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on the <strong>{subscriptionPlan.name}</strong>
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col items-start space-y-2 md:flex-row md:justify-between">
            <Button
              className="w-full"
              type="submit"
              disabled={isPending}
              variant={"default"}
            >
              {isPending ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : null}
              {subscriptionPlan.isSubscribed
                ? "Manage Subscription "
                : "Upgrade to Pro"}
            </Button>

            {subscriptionPlan.isSubscribed ? (
              <p className="rounded-full text-xs font-medium">
                {subscriptionPlan.isCanceled
                  ? `Your plan will be cancelled on `
                  : `Your plan renews on `}
                {format(subscriptionPlan.stripeCurrentPeriodEnd!, "dd.MM.yyyy")}
              </p>
            ) : null}
          </CardFooter>
        </Card>
      </form>
    </MaxWidthWrapper>
  );
};

export default BillingForm;
