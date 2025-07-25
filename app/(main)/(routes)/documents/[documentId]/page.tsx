"use client";

import { Cover } from "@/components/cover";
import dynamic from "next/dynamic";

import { useMemo, useState, useEffect } from "react";
import { useKeyStore } from "@/hooks/use-key-store";
import { encryptContent, decryptContent } from "@/lib/crypto";

import { ToolBar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useParams } from "next/navigation";

const DocumentIdPage = () => {
  const Editor = useMemo(
    () => dynamic(() => import("@/components/editor"), { ssr: false }),
    []
  );

  const { mek } = useKeyStore();
  const [decryptedContent, setDecryptedContent] = useState<string | undefined>(
    undefined
  );

  const params = useParams();
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId as Id<"documents">,
  });
  const update = useMutation(api.documents.update);

  useEffect(() => {
    if (document && document.content && mek) {
      decryptContent(document.content, mek)
        .then(setDecryptedContent)
        .catch((err) => {
          console.error("Failed to decrypt content:", err);
          setDecryptedContent("Error: Could not decrypt content.");
        });
    } else if (document && !document.content) {
      setDecryptedContent("");
    }
  }, [document, mek]);

  const onChange = async (content: string) => {
    if (!mek) return;

    const encrypted = await encryptContent(content, mek);

    update({
      id: params.documentId as Id<"documents">,
      content: encrypted,
    });
  };

  if (
    document === undefined ||
    (document?.content && decryptedContent === undefined)
  ) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div> Not Found </div>;
  }
  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <ToolBar initialData={document} />

        <Editor onChange={onChange} initialContent={decryptedContent} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
