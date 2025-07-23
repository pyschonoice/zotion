"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Documents = () => {

  const { user } = useUser()
  const create = useMutation(api.documents.create);
  const router = useRouter();

  const onCreate = () => {
    const promise = create({title:"Untitled"}).then((documentId) => router.push(`/documents/${documentId}`) )
    toast.promise(promise,{
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note."
    });
    
  };
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/note.svg"
        height={"300"}
        width={"300"}
        className="dark:hidden"
        alt="Empty"
      />
      <Image
        src="/note-dark.png"
        height={"300"}
        width={"300"}
        className="object-contain hidden dark:block"
        alt="Empty"
      />
      <h2 className="text-lg font-medium">
        Welcome <span className="font-bold">{user?.firstName}</span>, to your Zotion.
      </h2>
      <Button onClick={onCreate} className="cursor-pointer">
        <PlusCircle className="h-4 w-4 mr-2"/>
        Zot a Note
      </Button>
    </div>
  );
};

export default Documents;
