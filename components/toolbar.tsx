"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import {  ImageIcon, Smile, X } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import TextareaAutosize from "react-textarea-autosize"
import { useCoverImage } from "@/hooks/use-cover-image";

interface ToolBarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export const ToolBar = ({ initialData, preview }: ToolBarProps) => {
  const inputRef = useRef<ElementRef<"textarea">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialData.title);

  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);

  const coverImage = useCoverImage();

  const enableInput = () => {
    if (preview) return;

    setIsEditing(true);
    setTimeout(() => {
      setValue(initialData.title);
      inputRef.current?.focus();
    }, 0);
  };

  const disableInput = () => setIsEditing(false);

  const onInput = (value: string) => {
    setValue(value);
    update({
      id: initialData._id,
      title: value || "Untitled",
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      disableInput();
    }
  };

  const onIconSelect = (icon:string) => {
    update({
      id: initialData._id,
      icon
    })
  } 

  const onRemoveIcon = () => {
    removeIcon({id:initialData._id});
  }
  return (
    <div className="pl-[54px] group relative">
      <div className="flex items-center mb-6 gap-x-4">
      {!!initialData.icon && !preview && (
        <div className="relative group/icon">
          <IconPicker onChange={onIconSelect}>
            <p className="text-6xl hover:opacity-75  transition ">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={onRemoveIcon}
            className="absolute top-0 right-0 rounded-full opacity-100 md:opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
            variant={"outline"}
            size={"icon"}
          >
            <X className="h-2 w-2" />
          </Button>
        </div>
      )}
      {!!initialData && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="opacity-100 md:opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={onIconSelect}>
            <Button
              className="text-muted-foreground text-xs"
              variant={"outline"}
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add Icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <Button
            onClick={coverImage.onOpen}
            className="text-muted-foreground text-xs"
            variant={"outline"}
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add Cover
          </Button>
        )}
      </div>
    </div>
      {isEditing && !preview ? (
        <TextareaAutosize 
          ref={inputRef}
          onBlur={disableInput}
          onKeyDown={onKeyDown}
          value={value}
          onChange={(e)=>onInput(e.target.value)}
          className="text-4xl bg-transparent font-bold break-words outline-none text-[#3F3f3f] dark:text-[#cfcfcf] resize-none"
        />
      ) :  (
        <div className="pb-[11.5px] text-4xl font-bold break-words outline-none text-[#3F3f3f] dark:text-[#cfcfcf]" onClick={enableInput}>
          {initialData.title}
        </div>
      )}
    </div>
  );
};
