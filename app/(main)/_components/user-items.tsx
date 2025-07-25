"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronsLeftRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { SignOutButton, useUser } from "@clerk/clerk-react";
const UserItems = () => {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl}/>
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.fullName}&apos;s Zotion
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-4 h-4 w-4 text-muted-foreground"/>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
      className="w-80"
      align="start"
      alignOffset={11}
      forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-sm text-muted-foreground leading-none font-medium">
            {user?.emailAddresses[0].emailAddress}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl}/>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">
                {user?.fullName}&apos;s Zotion  
              </p>  
            </div>
          </div>
        </div>
        <DropdownMenuSeparator/>
        <DropdownMenuItem asChild className="w-full cursor-pointer text-muted-foreground">
          <SignOutButton>
            Log Out
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default UserItems;
