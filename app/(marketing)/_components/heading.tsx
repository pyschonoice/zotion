"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Heading = () => {
  return (
    <div className="max-w-5xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold md:text-left ">
        Where Ideas Meet Simplicity.
        <br /> Effort is Seamless. <br />
        Start with <span className="underline">Zotion</span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl font-medium md:text-left">
        In Zotion, write down your plans, notes, ideas resistance free.
      </h3>
      <div className="md:flex items-center md:justify-start   mt-10">
        <Link href={"/documents"}>
          <Button size={"lg"}>
            Start With Zotion
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
