"use client";

import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useConvexAuth } from "convex/react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";

const Navbar = () => {
  const scrolled = useScrollTop();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div
      className={cn(
        "z-50 bg-background fixed top-0 flex items-center w-full p-6 ",
        scrolled && "border-b shadow-sm"
      )}
    >
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-4">
        {isLoading && <Spinner />}
        {!isLoading && !isAuthenticated && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="lg">
                Login
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button>Start with Zotion</Button>
            </SignUpButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <div className="flex justify-end">
            <Button variant={"ghost"} asChild>
              <Link href="/documents">Enter Zotion</Link>
            </Button>
            <UserButton />
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
