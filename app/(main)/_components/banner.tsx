"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BannerProps {
  documentId: Id<"documents">;
}
const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();

  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const promise = remove({ id: documentId })
    
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted Successfully!",
      error: "Failed to delete note.",
    });
    router.push("/documents")
  };

  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored Successfully!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This Note is in the Trash. Do you wish to ? </p>
      
      <Button
        size={"sm"}
        variant={"outline"}
        onClick={onRestore}
        className="border-white bg-transparent hover:bg-rose-700 dark:hover:bg-rose-700  text-white hover:text-white p-1 px-2 h-auto font-medium cursor-pointer"
      >
        Restore Page
      </Button>
      <ConfirmModal onConfirm={onRemove}>
        <Button
          size={"sm"}
          variant={"outline"}
          className="border-white bg-transparent hover:bg-rose-700 dark:hover:bg-rose-700  text-white  p-1 px-2 h-auto font-medium cursor-pointer"
        >
          Delete Foreover
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
