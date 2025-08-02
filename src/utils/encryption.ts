import CryptoJS from 'crypto-js';

export type EncryptedMove = {
  encryptedData: string;
  iv: string;
  salt: string;
  timestamp: number;
};

export type GameMove = 'rock' | 'paper' | 'scissors';

/**
 * Encrypts a player's move using AES-256-GCM with a derived key
 */
export function encryptMove(move: GameMove, playerKey: string): EncryptedMove {
  // Generate random IV and salt
  const iv = CryptoJS.lib.WordArray.random(16);
  const salt = CryptoJS.lib.WordArray.random(32);
  
  // Derive key from player key + salt using PBKDF2
  const derivedKey = CryptoJS.PBKDF2(playerKey, salt, {
    keySize: 256/32,
    iterations: 10000
  });
  
  // Encrypt the move
  const encrypted = CryptoJS.AES.encrypt(move, derivedKey, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return {
    encryptedData: encrypted.toString(),
    iv: iv.toString(),
    salt: salt.toString(),
    timestamp: Date.now()
  };
}

/**
 * Decrypts a player's move using the provided key
 */
export function decryptMove(encryptedMove: EncryptedMove, playerKey: string): GameMove {
  try {
    // Recreate the derived key
    const salt = CryptoJS.enc.Hex.parse(encryptedMove.salt);
    const derivedKey = CryptoJS.PBKDF2(playerKey, salt, {
      keySize: 256/32,
      iterations: 10000
    });
    
    // Decrypt the move
    const decrypted = CryptoJS.AES.decrypt(encryptedMove.encryptedData, derivedKey, {
      iv: CryptoJS.enc.Hex.parse(encryptedMove.iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    const move = decrypted.toString(CryptoJS.enc.Utf8) as GameMove;
    
    if (!['rock', 'paper', 'scissors'].includes(move)) {
      throw new Error('Invalid decrypted move');
    }
    
    return move;
  } catch (error) {
    throw new Error('Failed to decrypt move: Invalid key or corrupted data');
  }
}

/**
 * Generates a random player key for encryption
 */
export function generatePlayerKey(): string {
  return CryptoJS.lib.WordArray.random(32).toString();
}

/**
 * Creates a hash of encrypted move for verification
 */
export function createMoveHash(encryptedMove: EncryptedMove): string {
  const moveString = JSON.stringify(encryptedMove);
  return CryptoJS.SHA256(moveString).toString();
}

/**
 * Verifies the integrity of an encrypted move
 */
export function verifyMoveIntegrity(encryptedMove: EncryptedMove, expectedHash: string): boolean {
  const actualHash = createMoveHash(encryptedMove);
  return actualHash === expectedHash;
}