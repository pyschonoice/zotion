"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useRef, useState } from "react";

interface TitleProps{
  initialData: Doc<"documents">;
  
}
const Title = ({
  initialData
}: TitleProps ) => {

  const update = useMutation(api.documents.update);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title || "Untitled")
  
  const enableInput = () => {
    setTitle(initialData.title)
    setIsEditing(true);
    setTimeout(()=>{
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0,inputRef.current.value.length)
    },0);
  }

  const disableInput = () => {
    setIsEditing(false);
  }

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTitle(event.target.value);
    update({
      id: initialData._id,
      title: event.target.value || "Untitled"
    });
  }

  const onKeyDown = (
    event:React.KeyboardEvent<HTMLInputElement>
  ) => {
    if(event.key === "Enter") disableInput();
  }

  return ( 
    <div className="flex items-center gap-x-1">
      {!!initialData.icon && (<p>{initialData.icon}</p>)}
      {isEditing ? (
        <Input 
          ref={inputRef} 
          onClick={enableInput}
          onBlur={disableInput}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={title}
          className="h-7 px-2 focus-visible:ring-transparent" 
        /> 
      ) : (
        <Button variant={"ghost"} size={"sm"} onClick={enableInput} className="h-auto font-normal p-1">
          <span className="trunacte">{initialData.title}</span>
        </Button>
      )}
    </div>
   );
}
 
export default Title;

Title.Skeleton = function TitleSkeleton(){
  return (
    <Skeleton className="h-4 w-20 rounded-md" />
  )
}