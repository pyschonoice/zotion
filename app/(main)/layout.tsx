"use client";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import { Unlock } from "@/components/unlock";
import { Spinner } from "@/components/spinner";
import Navigation from "./_components/navigation";
import { SearchCommand } from "@/components/search-command";

import { useEffect } from "react";
import { useKeyStore } from "@/hooks/use-key-store";
import { importMEK } from "@/lib/crypto";

const MainLayout = ({ children }: { children: React.ReactNode }) => {

  const { isAuthenticated, isLoading } = useConvexAuth();
  const { mek, setMek } = useKeyStore();

  useEffect(() => {
    const rehydrateKey = async () => {
      if (mek) return;

      try {
        const storedKey = sessionStorage.getItem("mek");
        if (storedKey) {
          const jwk = JSON.parse(storedKey);

          const imported = await importMEK(jwk);
          setMek(imported);
        }
      } catch (error) {
        console.error("Failed to rehydrate key:", error);
        sessionStorage.removeItem("mek");
      }
    };

    rehydrateKey();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={"lg"} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }

  if (mek === null) {
    return (
      <div className="h-full">
        <Unlock />
      </div>
    );
  }

  return (
    <div className="h-full flex">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommand />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
