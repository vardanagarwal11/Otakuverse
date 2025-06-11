const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Connect to the Solana testnet
const connection = new Connection('https://api.testnet.solana.com', 'confirmed');

// Use the provided deployer public key
const deployerPublicKey = new PublicKey('2BbjdS22iuHEwyNdKVEMm9wCvkqofDLeLagMY6F64Wxg');

// Program ID
const programId = new PublicKey('6XC7XVUWDQCLPGuJusuVRUnSuWLHFBLw8fDD7srCVAxE');

async function main() {
  try {
    // Check the balance of the deployer
    const balance = await connection.getBalance(deployerPublicKey);
    console.log(`Deployer balance: ${balance / 1000000000} SOL`);
    console.log(`Deployer public key: ${deployerPublicKey.toString()}`);

    // Check if the program exists
    try {
      const programInfo = await connection.getAccountInfo(programId);
      if (programInfo) {
        console.log('Program exists!');
        console.log(`Program size: ${programInfo.data.length} bytes`);
        console.log(`Program executable: ${programInfo.executable}`);
        console.log(`Program owner: ${programInfo.owner.toString()}`);
      } else {
        console.log('Program does not exist.');
      }
    } catch (error) {
      console.error('Error checking program:', error);
    }

    // Try with the program keypair
    try {
      const programKeypairPath = path.resolve(__dirname, 'target/deploy/otakuverse-program-keypair.json');
      const programKeypairData = JSON.parse(fs.readFileSync(programKeypairPath, 'utf8'));
      const programKeypair = Keypair.fromSecretKey(Buffer.from(programKeypairData));

      console.log(`Program keypair public key: ${programKeypair.publicKey.toString()}`);

      const programInfo = await connection.getAccountInfo(programKeypair.publicKey);
      if (programInfo) {
        console.log('Program exists with keypair public key!');
        console.log(`Program size: ${programInfo.data.length} bytes`);
        console.log(`Program executable: ${programInfo.executable}`);
        console.log(`Program owner: ${programInfo.owner.toString()}`);
      } else {
        console.log('Program does not exist with keypair public key.');
      }
    } catch (error) {
      console.error('Error checking program with keypair:', error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
