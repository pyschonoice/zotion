"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";
import { useKeyStore } from "@/hooks/use-key-store";
import { encryptContent, decryptContent } from "@/lib/crypto";

interface PublishProps {
  initialData: Doc<"documents">;
}
const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;
  const { mek } = useKeyStore();
  const [decryptedContent, setDecryptedContent] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    if (initialData && initialData.content && mek) {
      decryptContent(initialData.content, mek)
        .then(setDecryptedContent)
        .catch((err) => {
          console.error("Failed to decrypt content:", err);
          setDecryptedContent("Error: Could not decrypt content.");
        });
    } else if (initialData && !initialData.content) {
      setDecryptedContent("");
    }
  }, [initialData, mek]);

  const onPublish = async () => {
    if (!mek) return;
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: true,
      publishedContent: decryptedContent,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Publishing...",
      success: "Note Published!",
      error: "Failed to Publish Note",
    });
  };

  const onUnPublish = async () => {
    setIsSubmitting(true);
    const promise = update({
      id: initialData._id,
      isPublished: false,
      publishedContent: "",
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "Unpublishing...",
      success: "Note Unpublished!",
      error: "Failed to Unpublish Note",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant={"ghost"}>
          {initialData.isPublished ? (
            <div className="flex  items-center ">
              <span>Unpublish</span>
              <Globe className="h-4 w-4 text-sky-500 ml-2" />
            </div>
          ) : (
            <span> Publish</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <Globe className="h-4 w-4 text-sky-500 animate-pulse" />
                <p className="text-xs font-medium  text-sky-500">
                  This note is accessible by everyone
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Republish after the initial publish to display new changes you
                made on your note, due to encryption.
              </span>
            </div>

            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="h-8 rounded-l-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between w-full gap-x-2">
              <Button
                className="text-xs flex-1"
                size="sm"
                variant={"destructive"}
                disabled={isSubmitting}
                onClick={onUnPublish}
              >
                Unpublish
              </Button>
              <Button
                className="text-xs flex-1"
                size="sm"
                disabled={isSubmitting}
                onClick={onPublish}
              >
                Republish
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">Publish this Note</p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your note with the world.
            </span>
            <span className="text-xs text-muted-foreground mb-4">
              Republish after the initial publish to display new changes you
              made on your note, due to encryption.
            </span>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={isSubmitting}
              onClick={onPublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
