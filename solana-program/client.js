const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

// Connect to the Solana devnet
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Load the deployer keypair
const deployerKeypairPath = path.resolve(__dirname, '../otakuverse-deployer.json');
const deployerKeypairData = JSON.parse(fs.readFileSync(deployerKeypairPath, 'utf8'));
const deployerKeypair = Keypair.fromSecretKey(Buffer.from(deployerKeypairData));

// Program ID
const programId = new PublicKey('6WVQUSeRZPpZDukYxKc1gLjG1hRtUMHCGpvoC7vsEFw1');

async function main() {
  try {
    // Check the balance of the deployer
    const balance = await connection.getBalance(deployerKeypair.publicKey);
    console.log(`Deployer balance: ${balance / 1000000000} SOL`);
    console.log(`Deployer public key: ${deployerKeypair.publicKey.toString()}`);

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
