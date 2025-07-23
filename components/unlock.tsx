"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useKeyStore } from "@/hooks/use-key-store";
import * as crypto from "@/lib/crypto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/spinner";

export const Unlock = () => {
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const userData = useQuery(api.users.getUser);
  const createUser = useMutation(api.users.createUser);
  const { setMek } = useKeyStore();

  // 🔁 Safe determination of new user
  useEffect(() => {
    if (userData === null) {
      setIsNewUser(true);
    } else if (userData !== undefined) {
      setIsNewUser(false);
    }
  }, [userData]);

  const handleUnlock = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("isNewUser:", isNewUser);
      if (isNewUser) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const pdk = await crypto.derivePDK(password, salt);
        const mek = await crypto.generateMEK();
        const wrappedMek = await crypto.wrapMEK(mek, pdk);

        await createUser({
          wrappedMek,
          salt: Buffer.from(salt).toString("base64"),
        });
        setMek(mek);
      } else if (userData) {
        const salt = Buffer.from(userData.salt, "base64");
        if (salt.length !== 16) {
          throw new Error("Invalid salt length");
        }
        const pdk = await crypto.derivePDK(password, salt);
        const mek = await crypto.unwrapMEK(userData.wrappedMek, pdk);
        setMek(mek);
      }
    } catch (err: any) {
      console.error("Unlock error:", err);
      const message = err?.message || "Unknown error";
      setError("Incorrect password or an error occurred: " + message);
    } finally {
      setIsLoading(false);
    }
  };

  if (userData === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-y-4">
      <h2 className="text-xl font-semibold">
        {isNewUser ? "Create a Data Password" : "Unlock Your Notes"}
      </h2>
      <p className="text-muted-foreground text-sm">
        {isNewUser
          ? "This password encrypts your data. If you lose it, your data is lost."
          : "Enter the password you created to decrypt your data."}
      </p>
      <form
        onSubmit={handleUnlock}
        className="flex flex-col items-center gap-y-2"
      >
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your data password..."
          className="w-80"
          disabled={isLoading}
        />

        <Button type="submit" className="w-80" disabled={isLoading}>
          {isLoading ? "Unlocking..." : "Unlock"}
        </Button>

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </form>
    </div>
  );
};
