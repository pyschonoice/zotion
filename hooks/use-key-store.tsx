import { create } from "zustand";
import { exportMEK } from "@/lib/crypto";

type KeyStore = {
  mek: CryptoKey | null;
  setMek: (key: CryptoKey | null) => void;
};

export const useKeyStore = create<KeyStore>((set) => ({
  mek: null,

  setMek: async (key) => {
    set({ mek: key });
    if (key) {
      const exportedKey = await exportMEK(key);
      sessionStorage.setItem("mek", JSON.stringify(exportedKey));
    } else {
      sessionStorage.removeItem("mek");
    }
  },
}));
