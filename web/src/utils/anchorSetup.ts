import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';

// Program ID from deployment
export const PROGRAM_ID = new PublicKey('6XC7XVUWDQCLPGuJusuVRUnSuWLHFBLw8fDD7srCVAxE');
export const NETWORK = 'https://api.testnet.solana.com';

export function getProvider(wallet: any): AnchorProvider {
  const connection = new Connection(NETWORK, 'confirmed');
  return new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
}

export function getProgram(wallet: any) {
  const provider = getProvider(wallet);
  
  // Simplified IDL for the program
  const idl = {
    version: "0.1.0",
    name: "otakuverse_program",
    instructions: [
      {
        name: "initialize",
        accounts: [
          { name: "globalState", isMut: true, isSigner: false },
          { name: "authority", isMut: true, isSigner: true },
          { name: "systemProgram", isMut: false, isSigner: false }
        ],
        args: []
      },
      {
        name: "stakeNft",
        accounts: [
          { name: "stakingAccount", isMut: true, isSigner: false },
          { name: "staker", isMut: true, isSigner: true },
          { name: "nftMint", isMut: false, isSigner: false },
          { name: "userTokenAccount", isMut: true, isSigner: false },
          { name: "programTokenAccount", isMut: true, isSigner: false },
          { name: "programAuthority", isMut: false, isSigner: false },
          { name: "tokenProgram", isMut: false, isSigner: false },
          { name: "associatedTokenProgram", isMut: false, isSigner: false },
          { name: "systemProgram", isMut: false, isSigner: false }
        ],
        args: [{ name: "nftMint", type: "publicKey" }]
      }
    ],
    accounts: [
      {
        name: "GlobalState",
        type: {
          kind: "struct",
          fields: [
            { name: "authority", type: "publicKey" },
            { name: "totalNftsMinted", type: "u64" },
            { name: "totalStaked", type: "u64" },
            { name: "totalProposals", type: "u64" },
            { name: "totalEvents", type: "u64" }
          ]
        }
      }
    ]
  };
  
  return new Program(idl as any, PROGRAM_ID, provider);
}