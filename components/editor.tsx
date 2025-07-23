"use client";

import { useTheme } from "next-themes";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, Theme } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {

  const {edgestore} = useEdgeStore();
  const resolvedTheme = useTheme();
  const handleUpload = async (file:File) => {
    const response = await edgestore.publicFiles.upload({
      file
    })

    return response.url;
  }

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
      uploadFile:handleUpload
  });

  

  const darkTheme = {
    colors: {
      editor: {
        background: "#191919",
      },
    },
  };

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme.systemTheme === "dark" ? darkTheme : "light"}
        editable={editable}
        onChange={() => {
          onChange(JSON.stringify(editor.document, null, 2));
        }}
        
      />
    </div>
  );
};

export default Editor;