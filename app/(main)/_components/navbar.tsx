"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MenuIcon } from "lucide-react";
import { useParams } from "next/navigation";
import Banner from "./banner";
import Menu from "./menu";
import Title from "./title";
import NavbarList from "./navbar-list";
import Publish from "./publish";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}
const Navbar = ({ isCollapsed, onResetWidth }: NavbarProps) => {
  const params = useParams();

  const path = useQuery(api.documents.getPath, {
    id: params.documentId as Id<"documents">,
  });

  if (path === undefined) {
    return (
      <nav className="bg-background px-3 py-2 w-full flex items-center justify-between">
        <Title.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeleton />
        </div>
      </nav>
    );
  }

  if (path === null || path.length === 0) {
    return null;
  }

  const currentDocument = path[path.length - 1];

  return (
    <>
      <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="h-6 w-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-between w-full">
          <NavbarList path={path} />
          <div className="flex items-center gap-x-2">
            <Publish initialData={currentDocument} />
            <Menu documentId={currentDocument._id} />
          </div>
        </div>
      </nav>

      {currentDocument.isArchived && (
        <Banner documentId={currentDocument._id} />
      )}
    </>
  );
};

export default Navbar;
