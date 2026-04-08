import * as forge from 'node-forge';
import { Buffer } from 'buffer';

/**
 * Fetches the RSA public key from the Megapagos API via the internal route.
 */
async function getPublicKey(): Promise<string> {
  const res = await fetch('/api/megapagos/public-key');
  if (!res.ok) throw new Error('Error al obtener la llave pública');
  const { public_key } = await res.json();
  return Buffer.from(public_key, 'base64').toString('ascii');
}

/**
 * Generates a random 256-bit AES key.
 */
function generateAESKey(): string {
  return forge.random.getBytesSync(32);
}

/**
 * Generates a random 16-byte IV.
 */
function generateIV(): string {
  return forge.random.getBytesSync(16);
}

/**
 * Encrypts a string value using AES-CBC with the given base64-encoded key.
 * Returns a base64-encoded JSON string containing the IV and ciphertext.
 */
function encrypt(value: string, key: string): string {
  const keyBytes = forge.util.createBuffer(forge.util.decode64(key));
  const iv = generateIV();
  const cipher = forge.cipher.createCipher('AES-CBC', keyBytes);
  cipher.start({ iv });
  cipher.update(forge.util.createBuffer(value, 'utf8'));
  cipher.finish();
  const ciphertext = cipher.output.getBytes();
  return forge.util.encode64(
    JSON.stringify({
      iv: forge.util.encode64(iv),
      value: forge.util.encode64(ciphertext),
    })
  );
}

/**
 * Encrypts an AES key using RSA-OAEP with the given PEM public key.
 * Returns the base64-encoded encrypted key.
 */
function encryptKey(aesKey: string, publicKeyPem: string): string {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
  const encrypted = publicKey.encrypt(aesKey, 'RSA-OAEP', {
    md: forge.md.sha1.create(),
    mgf1: { md: forge.md.sha1.create() },
  });
  return forge.util.encode64(encrypted);
}

/**
 * Hybrid-encrypts data: AES-CBC for the payload, RSA-OAEP for the AES key.
 * Returns an object with encryptedKey and encryptedData.
 */
function hybridEncrypt(data: string, publicKeyPem: string): object {
  const aesKey = generateAESKey();
  const aesKeyBase64 = forge.util.encode64(aesKey);
  return {
    encryptedKey: encryptKey(aesKey, publicKeyPem),
    encryptedData: encrypt(data, aesKeyBase64),
  };
}

/**
 * Encrypts a value using hybrid RSA+AES encryption.
 * Fetches the public key, encrypts the value, and returns a base64-encoded JSON string.
 * Returns an empty string if any error occurs.
 */
export async function setInfo(value: string): Promise<string> {
  try {
    const publicKeyPem = await getPublicKey();
    const encrypted = hybridEncrypt(value, publicKeyPem);
    return forge.util.encode64(JSON.stringify(encrypted));
  } catch (error) {
    console.error('Error al encriptar:', error);
    return '';
  }
}
