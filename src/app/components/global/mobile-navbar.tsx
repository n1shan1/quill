"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  isAuth: boolean;
}

const MobileNavbar = ({ isAuth }: Props) => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const toggleOpen = () => setOpen((prev) => !prev);

  // Close the menu on route change
  useEffect(() => {
    if (open) toggleOpen();
  }, [pathName]);

  // Toggle menu open/closed

  const onCloseCurrent = (href: string) => {
    if (pathName === href) {
      toggleOpen();
    }
  };

  return (
    <div className="sm:hidden">
      {/* Toggle Button */}
      <Button variant="ghost" onClick={toggleOpen}>
        <MenuIcon className="relative z-50 h-5 w-5 text-card-foreground" />
      </Button>

      {/* Mobile Menu */}
      {open ? (
        <div className="fixed top-0 left-0 right-0 z-40 w-full h-screen animate-in slide-in-from-top-5 fade-in-20">
          <ul className="absolute top-0 left-0 right-0 bg-background border-b border-foreground shadow-xl grid w-full gap-3 px-10 pt-20 pb-8">
            {!isAuth ? (
              <div>
                <li>
                  <Link
                    onClick={() => onCloseCurrent("/dashboard")}
                    href="/sign-up"
                    className="flex items-center w-full font-semibold text-accent-foreground"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-foreground/60"></li>
                <li>
                  <Link
                    onClick={() => onCloseCurrent("/dashboard")}
                    href="/sign-in"
                    className="flex items-center w-full font-semibold text-accent-foreground"
                  >
                    Sign In
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-foreground/60"></li>
                <li>
                  <Link
                    onClick={() => onCloseCurrent("/pricing")}
                    href="/pricing"
                    className="flex items-center w-full font-semibold text-accent-foreground"
                  >
                    Pricing
                  </Link>
                </li>
              </div>
            ) : (
              <>
                {" "}
                <li>
                  <Link
                    onClick={() => onCloseCurrent("/dashboard")}
                    href="/dashboard"
                    className="flex items-center w-full font-semibold text-accent-foreground"
                  >
                    Dashboard
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </li>
                <li className="my-3 h-px w-full bg-foreground/60"></li>
                <li>
                  <Link
                    onClick={() => onCloseCurrent("/sign-out")}
                    href="/sign-out"
                    className="flex items-center w-full font-semibold text-accent-foreground"
                  >
                    Sign Out
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default MobileNavbar;
