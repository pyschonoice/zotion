

// We use btoa and atob to easily store binary data (ArrayBuffer) as strings in our database.
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Generates the Main Encryption Key (MEK)
export async function generateMEK(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Derives a key from a password (PDK)
export async function derivePDK(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt, iterations: 100000, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["wrapKey", "unwrapKey"]
  );
}

// Encrypts the MEK with the PDK ("wrapping")
export async function wrapMEK(mek: CryptoKey, pdk: CryptoKey): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const wrappedKey = await crypto.subtle.wrapKey("jwk", mek, pdk, {
    name: "AES-GCM",
    iv,
  });

  // Return base64(iv):base64(wrappedKey)
  return `${arrayBufferToBase64(iv)}:${arrayBufferToBase64(wrappedKey)}`;
}

// Decrypts the MEK with the PDK ("unwrapping")
export async function unwrapMEK(wrappedMekWithIv: string, pdk: CryptoKey): Promise<CryptoKey> {
  const [ivBase64, wrappedKeyBase64] = wrappedMekWithIv.split(":");
  if (!ivBase64 || !wrappedKeyBase64) {
    throw new Error("Invalid wrappedMek format.");
  }

  const iv = base64ToArrayBuffer(ivBase64);
  const wrappedKey = base64ToArrayBuffer(wrappedKeyBase64);

  return await crypto.subtle.unwrapKey(
    "jwk",
    wrappedKey,
    pdk,
    { name: "AES-GCM", iv: iv },
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}


// Encrypts document content with the MEK
export async function encryptContent(content: string, mek: CryptoKey): Promise<string> {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedContent = new TextEncoder().encode(content);
    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        mek,
        encodedContent
    );
    // We store the IV with the encrypted content, separated by a character that won't appear in base64.
    return `${arrayBufferToBase64(iv)}:${arrayBufferToBase64(encryptedContent)}`;
}

// Decrypts document content with the MEK
export async function decryptContent(encryptedString: string, mek: CryptoKey): Promise<string> {
    const [ivBase64, contentBase64] = encryptedString.split(':');
    if (!ivBase64 || !contentBase64) {
        throw new Error("Invalid encrypted content format.");
    }
    const iv = base64ToArrayBuffer(ivBase64);
    const encryptedContent = base64ToArrayBuffer(contentBase64);

    const decryptedContent = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        mek,
        encryptedContent
    );

    return new TextDecoder().decode(decryptedContent);
}

export async function exportMEK(mek: CryptoKey): Promise<JsonWebKey> {
    return await crypto.subtle.exportKey("jwk", mek);
}

export async function importMEK(jwk: JsonWebKey): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
        "jwk", 
        jwk, 
        { name: "AES-GCM" }, 
        true, 
        ["encrypt", "decrypt"]
    );
}