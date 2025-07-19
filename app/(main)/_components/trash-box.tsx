"use client";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Search, Trash2, Undo2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const TrashBox = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getTrash);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);

  const [search, setSearch] = useState("");
  const filteredDocuments = documents?.filter((document) => {
    return document.title.toLowerCase().includes(search.toLowerCase());
  });

  const onClick = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  const onRestore = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    documentId: Id<"documents">
  ) => {
    event.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored Successfully!",
      error: "Failed to restore note.",
    });
  };

  const onRemove = (documentId: Id<"documents">) => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted Successfully!",
      error: "Failed to delete note.",
    });
    if (params.documentId === documentId) {
      router.push("/documents");
    }
  };

  const removeAll = () => {
    filteredDocuments?.map((document) => {
      const promise = remove({ id: document._id });
      toast.promise(promise, {
        loading: "Deleting All Matched Notes...",
        success: "All Notes deleted Successfully!",
        error: "Failed to delete notes.",
      });
      if (params.documentId === document._id) {
        router.push("/documents");
      }
    });
  };

  if (documents === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size={"lg"} />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4 mr-1" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by Page Title"
        />
        <ConfirmModal onConfirm={() => removeAll()}>
          <div className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600">
            <Trash2 className="h-4 w-4 shrink-0 text-muted-foreground" />
          </div>
        </ConfirmModal>
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-center text-muted-foreground pb-2">
          No Notes Found.
        </p>
        {filteredDocuments?.map((document) => (
          <div
            key={document._id}
            role="button"
            onClick={() => onClick(document._id)}
            className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
          >
            <span className="truncate pl-2"> {document.title}</span>
            <div className="flex items-center">
              <div
                onClick={(e) => {
                  onRestore(e, document._id);
                }}
                className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <Undo2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <ConfirmModal onConfirm={() => onRemove(document._id)}>
                <div className="rounded-sm p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600">
                  <Trash2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrashBox;
