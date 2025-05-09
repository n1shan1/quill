import React from "react";
import MaxWidthWrapper from "./components/global/max-width-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

type Props = {};

function page({}: Props) {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full border border-foreground/80 bg-white dark:bg-slate-900 px-7 py-2 shadow-md backdrop-blur-lg transition-all hover:border-gray-500 hover:bg-white/50 dark:hover:bg-slate-800/80 hover:scale-[1.03] duration-500">
          <p className="text-sm font-semibold text-muted-foreground dark:text-muted-foreground/90">
            SignUp Today
          </p>
        </div>
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          <span className="italic font-light">&apos;Chat&apos;</span> with your{" "}
          <span className="text-clip text-transparent bg-gradient-to-r from-primary/60 to-foreground dark:from-primary/70 dark:to-blue-300 bg-clip-text">
            documents
          </span>{" "}
          in your own ways!
        </h1>
        <p className="mt-5 max-w-prose text-md text-muted-foreground sm:text-xl dark:text-muted-foreground/90">
          Quill allows you to understand your PDF in a personalized way, that
          suits you! <br />
          Casually upload your PDF&apos;s and ask!
        </p>
        <Link href={"/dashboard"} className="mt-8">
          <Button
            variant={"default"}
            size={"lg"}
            className="dark:bg-primary/90 dark:hover:bg-primary/80"
          >
            <p className="group flex items-center justify-between gap-3 font-bold">
              Get Started{" "}
              <ArrowRight className="group-hover:transform group-hover:translate-x-1 transition-all duration-200 h-4 w-4" />
            </p>
          </Button>
        </Link>
      </MaxWidthWrapper>
      <div>
        <div className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80e5] to-[#9080fc] opacity-30 dark:opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <div>
            <div className="mx-auto max-w-6xl px-6 lg:px-6">
              <div className="mt-16 flow-root sm:mt-24">
                <div className="-m-2 rounded-xl bg-white dark:bg-slate-900/70 p-2 ring-1 ring-inset ring-white/50 dark:ring-slate-700/50 lg:-m-4 ld:rounded-2xl lg:p-4">
                  <Image
                    className="rounded-xl shadow-2xl ring-1 ring-white/50 dark:ring-slate-700/50 lg:rounded-2xl lg:ring-0"
                    src={"/dashboard-preview.jpg"}
                    width={1364}
                    height={866}
                    alt="img"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80e5] to-[#9080fc] dark:from-[#ff80e5]/60 dark:to-[#9080fc]/60 opacity-30 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            />
          </div>
        </div>
      </div>
      <div className="mx-auto mb-32 mt-32 max-w-5xl sm:mt-56">
        <div className="mb-12 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="mt-2 font-bold text-4xl text-accent-foreground dark:text-white sm:text-5xl">
              Start Chatting in minutes!
            </h2>
            <p className="mt-4 text-lg text-muted-foreground dark:text-muted-foreground/90">
              Chatting to your PDF has never been easier than with Quill AI.
            </p>
          </div>
        </div>
        <ol className="my-8 space-y-4 pt-8 md:flex md:space-x-12 md:space-y-0">
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground/50 dark:border-muted-foreground/30 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-md text-blue-600 dark:text-blue-400">
                Step 1
              </span>
              <span className="text-xl font-semibold dark:text-white">
                SignUp for an account
              </span>
              <span className="mt-2 text-foreground dark:text-foreground/90">
                Either Starting out with a free plan or choose our{" "}
                <Link
                  className="text-blue-600 dark:text-blue-400 underline underline-offset-2"
                  href={"/pricing"}
                >
                  pro
                </Link>{" "}
                plan.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground/50 dark:border-muted-foreground/30 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-md text-blue-600 dark:text-blue-400">
                Step 2
              </span>
              <span className="text-xl font-semibold dark:text-white">
                Upload your PDF Files
              </span>
              <span className="mt-2 text-foreground dark:text-foreground/90">
                We&apos;ll process your files and make them ready for chatting.
              </span>
            </div>
          </li>
          <li className="md:flex-1">
            <div className="flex flex-col space-y-2 border-l-4 border-muted-foreground/50 dark:border-muted-foreground/30 py-2 pl-4 md:border-l-0 md:border-t-2 md:pb-0 md:pl-0 md:pt-4">
              <span className="text-sm font-md text-blue-600 dark:text-blue-400">
                Step 3
              </span>
              <span className="text-xl font-semibold dark:text-white">
                Start Asking Questions.
              </span>
              <span className="mt-2 text-foreground dark:text-foreground/90">
                Ask any question you have in mind and we&apos;ll get you the
                answer.
              </span>
            </div>
          </li>
        </ol>
      </div>
      <div className="">
        <div className="mx-auto max-w-6xl px-6 lg:px-6">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl bg-white dark:bg-slate-900/70 p-2 ring-1 ring-inset ring-white/50 dark:ring-slate-700/50 lg:-m-4 ld:rounded-2xl lg:p-4">
              <Image
                className="rounded-xl shadow-2xl ring-1 ring-white/50 dark:ring-slate-700/50 lg:rounded-2xl lg:ring-0"
                src={"/file-upload-preview.jpg"}
                width={1419}
                height={732}
                alt="img"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
