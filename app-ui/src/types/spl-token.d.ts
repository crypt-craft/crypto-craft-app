/**
 * Solana SPL Token Type Definitions
 * 
 * This file provides type definitions for the @solana/spl-token package.
 * It's used to fix the TypeScript errors about missing properties.
 */

declare module '@solana/spl-token' {
  import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';

  export const TOKEN_PROGRAM_ID: PublicKey;
  
  export function getMinimumBalanceForRentExemptMint(connection: Connection): Promise<number>;
  
  export function createInitializeMintInstruction(
    mint: PublicKey,
    decimals: number,
    mintAuthority: PublicKey,
    freezeAuthority: PublicKey | null,
    programId?: PublicKey
  ): TransactionInstruction;
  
  export function getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve?: boolean,
    programId?: PublicKey,
    associatedTokenProgramId?: PublicKey
  ): Promise<PublicKey>;
  
  export function createAssociatedTokenAccountInstruction(
    payer: PublicKey,
    associatedToken: PublicKey,
    owner: PublicKey,
    mint: PublicKey,
    programId?: PublicKey,
    associatedTokenProgramId?: PublicKey
  ): Promise<TransactionInstruction>;
  
  export function createMintToInstruction(
    mint: PublicKey,
    destination: PublicKey,
    mintAuthority: PublicKey,
    amount: number | bigint,
    multiSigners?: any[],
    programId?: PublicKey
  ): TransactionInstruction;
} 