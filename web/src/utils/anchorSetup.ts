import { AnchorProvider, Program, web3, Idl } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { OtakuVerseProgram } from '../types/program';

// Import the IDL
import idl from './otakuverse_anchor_program.json';

// Define the program ID
export const PROGRAM_ID = new web3.PublicKey('6WVQUSeRZPpZDukYxKc1gLjG1hRtUMHCGpvoC7vsEFw1');
export const NETWORK = 'https://api.testnet.solana.com';

export function getProvider(wallet: any): AnchorProvider {
  const connection = new web3.Connection(NETWORK, 'confirmed');
  return new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
}

export function getProgram(wallet: any): OtakuVerseProgram {
  const provider = getProvider(wallet);
  // @ts-ignore - The type system doesn't understand the Program constructor properly
  const program = new Program(idl as unknown as Idl, PROGRAM_ID, provider);
  return program as unknown as OtakuVerseProgram;
}
