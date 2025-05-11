import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";
import MaxWidthWrapper from "../components/global/max-width-wrapper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/config/stripe";
import { cn } from "@/lib/utils";
import { ArrowRight, Check, HelpCircle, Minus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import UpgradeButton from "./_components/upgrade-button";

const pricingItems = [
  {
    plan: "Free",
    tagline: "For small side projects.",
    quota: 10,
    features: [
      {
        text: "5 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        negative: true,
      },
      {
        text: "Priority support",
        negative: true,
      },
    ],
  },
  {
    plan: "Pro",
    tagline: "For larger projects with higher needs.",
    quota: PLANS.find((p) => p.slug === "pro")!.quota,
    features: [
      {
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Mobile-friendly interface",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      {
        text: "Priority support",
      },
    ],
  },
];

async function PricingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <>
      <MaxWidthWrapper className="mb-8 mt-24 text-center max-w-5xl">
        <div className="mx-auto mb-10 sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-muted-foreground/60 sm:text-lg">
            Weather you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>
        <div className="pt-12 grid grid-col-1 gap-10 lg:grid-cols-2">
          <TooltipProvider>
            {pricingItems.map(({ plan, tagline, quota, features }) => {
              const price =
                PLANS.find((p) => p.slug === plan.toLowerCase())?.price
                  .amount || 0;
              return (
                <div
                  key={plan}
                  className={cn(
                    "relative rounded-2xl bg-background shadow-lg",
                    {
                      "border-2 border-blue-500 shadow-primary/60":
                        plan === "Pro",
                      "border border-foreground/50": plan !== "Pro",
                    }
                  )}
                >
                  {plan === "Pro" && (
                    <div className="absolute -top-5 left-0 right-0 mx-auto w-32 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-2 text-sm font-medium text-background">
                      Upgrade Now
                    </div>
                  )}

                  <div className="p-5">
                    <h3 className="my-3 text-center font-display text-3xl font-bold">
                      {plan}
                    </h3>
                    <p className="text-muted-foreground">{tagline}</p>
                    <p className="my-5 font-display text-6xl font-semibold">
                      ₹{price}
                    </p>
                    <p className="text-foreground/60">per month</p>
                  </div>
                  <div className="flex h-20 items-center justify-center  border-t border-foreground/40 bg-muted-foreground/10 ">
                    <div className="flex items-center space-x-1">
                      <p className="">
                        {quota.toLocaleString()} PDF&apos;s per month included.
                      </p>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger className="ml-1.5 cursor-default">
                          <HelpCircle className="h-4 w-4 text-muted-foreground/70" />
                        </TooltipTrigger>
                        <TooltipContent className="w-80 p-2">
                          How many PDF&apos;s can you upload per month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  <ul className="my-10 space-y-5 px-8">
                    {features.map(({ text, footnote, negative }) => (
                      <li key={text} className="flex space-x-5">
                        <div className="flex-shrink-0">
                          {negative ? (
                            <Minus className="h-6 w-6 text-foreground/50" />
                          ) : (
                            <Check className="h-6 w-6 text-foreground/50" />
                          )}
                        </div>
                        {footnote ? (
                          <div className="flex items-center space-x-2">
                            <p
                              className={cn("text-muted-foreground/90", {
                                "text-foreground/60": negative,
                              })}
                            >
                              {text}
                            </p>
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="ml-1.5 cursor-default">
                                <HelpCircle className="h-4 w-4 text-muted-foreground/70" />
                              </TooltipTrigger>
                              <TooltipContent className="w-80 p-2">
                                {footnote}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        ) : (
                          <p
                            className={cn("text-muted-foreground/90", {
                              "text-foreground/60": negative,
                            })}
                          >
                            {text}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-b border-foreground/50"></div>
                  <div className="p-5">
                    {plan === "Free" ? (
                      <Link
                        href={user ? "/dashboard" : "/sign-in"}
                        className={cn(buttonVariants({ className: "w-full" }))}
                      >
                        {user ? "Continue to Dashboard" : "Get Started"}
                      </Link>
                    ) : user ? (
                      <UpgradeButton />
                    ) : (
                      <Link
                        href={"/sign-in"}
                        className={cn(
                          buttonVariants({
                            className: "w-full",
                            variant: "secondary",
                          })
                        )}
                      >
                        {user ? "Upgrade Now" : "Sign Up"}
                        <ArrowRight className="h-5 w-5 ml-1.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
}

export default PricingPage;
