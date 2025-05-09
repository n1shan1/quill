import React from "react";
import MaxWidthWrapper from "./max-width-wrapper";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
type Props = {};

function Navbar({}: Props) {
  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-foreground/60 bg-background/75 backdrop-blur-lg transition-all ">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between border-b border-foreground/60">
          <Link href={"/"} className="flex z-40 font-semibold">
            <span className="font-bold sm:text-2xl">quill.</span>
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href={"/pricing"}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Pricing
              </Link>
              <LoginLink
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                <p>SignIn</p>
              </LoginLink>

              <RegisterLink
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                <p className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </p>
              </RegisterLink>
              <ModeToggle />
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default Navbar;
