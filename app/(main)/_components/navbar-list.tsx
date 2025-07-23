"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Title from "./title";

interface NavbarListProps {
  path: Doc<"documents">[];
}

const NavbarList = ({ path }: NavbarListProps) => {
  const router = useRouter();
  const currentDocument = path[path.length - 1];
  const breadcrumbs = path.slice(0, -1);

  return (
    <div className="flex items-center gap-x-1">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb._id} className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/documents/${crumb._id}`)}
            className="h-auto font-normal p-1"
          >
            <span className="truncate max-w-[150px]">{crumb.title}</span>
          </Button>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      ))}
      <Title initialData={currentDocument} />
    </div>
  );
};

export default NavbarList;
