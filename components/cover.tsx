"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCoverImage } from "@/hooks/use-cover-image";
import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ImageIcon, Trash } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface CoverProps {
  url?: string;
  preview?: boolean;
}
export const Cover = ({ url, preview }: CoverProps) => {
  const coverImage = useCoverImage();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const params = useParams();
  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if(url){
      await edgestore.publicFiles.delete({
        url: url,
      });
    }
    const promise = removeCoverImage({
      id: params.documentId as Id<"documents">,
    });
    toast.promise(promise, {
      loading: "Removing Cover Image...",
      success: "Cover Image removed Successfully!",
      error: "Failed to remove cover image.",
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh] mb-4 group",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && <Image src={url} fill className="object-cover" alt="Cover" />}
      {url && !preview && (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={()=>{coverImage.onReplace(url)}}
            className="text-muted-foreground text-xs"
            variant={"secondary"}
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Change Cover
          </Button>
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant={"secondary"}
            size="sm"
          >
            <Trash className="h-4 w-4 mr-2" />
            Remove Cover
          </Button>
        </div>
      )}
    </div>
  );
};


Cover.Skeleton = function CoverSkeleton(){
  return(
    <Skeleton className="w-full h-[12vh]"/>
  )
}