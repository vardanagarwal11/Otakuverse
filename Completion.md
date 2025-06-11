# OtakuVerse Complete Deployment Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Guide](#installation-guide)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Setup](#project-setup)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance](#maintenance)
10. [Security](#security)

## System Requirements

### Minimum Hardware Requirements
- CPU: 4 cores or better
- RAM: 8GB minimum (16GB recommended)
- Storage: 50GB free space
- Internet: Stable broadband connection

### Operating System
- Windows 10/11
- macOS 10.15 or later
- Ubuntu 20.04 LTS or later

### Required Software
1. Git
2. Node.js (v18.x)
3. Rust (latest stable)
4. Solana CLI (v1.17.0)
5. Anchor Framework
6. Code Editor (VS Code recommended)
7. Web Browser (Chrome/Firefox)
8. Phantom Wallet (browser extension)

## Installation Guide

### 1. Install Git
```bash
# Windows
Download from: https://git-scm.com/download/win

# macOS
brew install git

# Ubuntu
sudo apt-get update
sudo apt-get install git
```

### 2. Install Node.js and npm
```bash
# Windows
Download from: https://nodejs.org/

# macOS
brew install node

# Ubuntu
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. Install Rust
```bash
# All platforms
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# After installation
source $HOME/.cargo/env
rustup update
rustup component add rustfmt
rustup component add clippy
```

### 4. Install Solana CLI
```bash
# All platforms
curl --proto '=https' --tlsv1.2 -sSfL https://solana-install.solana.workers.dev | bash

# Add to PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Verify installation
solana --version
```

### 5. Install Anchor Framework
```bash
# Install Anchor Version Manager
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor version
avm install latest
avm use latest

# Verify installation
anchor --version
```

### 6. Install VS Code
1. Download from: https://code.visualstudio.com/
2. Install recommended extensions:
   - Rust Analyzer
   - Solana
   - Anchor
   - TypeScript and JavaScript Language Features
   - ESLint
   - Prettier

### 7. Install Phantom Wallet
1. Visit: https://phantom.app/
2. Click "Add to Chrome/Firefox"
3. Create a new wallet
4. Save your seed phrase securely
5. Switch to Testnet in settings

## Development Environment Setup

### 1. Configure Solana
```bash
# Set to testnet
solana config set --url testnet

# Create new wallet
solana-keygen new

# Save the output keypair file securely
# Default location: ~/.config/solana/id.json

# Get testnet SOL (requires faucet access or testnet funds)
solana airdrop 2
```

### 2. Configure Git
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Set up Project Directory
```bash
# Create project directory
mkdir OtakuVerse
cd OtakuVerse

# Initialize git
git init
```

## Project Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd OtakuVerse
```

### 2. Set up Solana Program
```bash
cd solana-program

# Install dependencies
npm install

# Create Anchor.toml if not exists
anchor init

# Update Anchor.toml
cat > Anchor.toml << EOL
[features]
seeds = false
skip-lint = false

[programs.testnet]
otakuverse = "<program_id>"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "testnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
EOL

# Build program
anchor build

# Deploy program
anchor deploy --provider.cluster testnet

# Save program ID
PROGRAM_ID=$(solana address -k target/deploy/otakuverse-keypair.json)
echo "Program ID: $PROGRAM_ID"
```

### 3. Set up Web Application
```bash
cd ../web

# Install dependencies
npm install

# Create environment file
cat > .env << EOL
VITE_PROGRAM_ID=$PROGRAM_ID
VITE_RPC_URL=https://api.testnet.solana.com
VITE_NETWORK=testnet
EOL

# Install additional dependencies
npm install @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-base @solana/wallet-adapter-wallets
```

## Configuration

### 1. Program Configuration

#### Update lib.rs
```rust
use anchor_lang::prelude::*;

declare_id!("$PROGRAM_ID");

#[program]
pub mod otakuverse {
    // Your program code here
}
```

#### Update state files
1. `src/state/nft.rs`:
```rust
#[account]
pub struct NFTData {
    pub owner: Pubkey,
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub rarity: NFTRarity,
    pub is_for_sale: bool,
    pub price: u64,
    pub created_at: i64,
    pub attributes: Vec<NFTAttribute>,
    pub royalty_basis_points: u16,
}
```

2. `src/state/badge.rs`:
```rust
#[account]
pub struct BadgeData {
    pub owner: Pubkey,
    pub badge_id: u64,
    pub name: String,
    pub description: String,
    pub rarity: BadgeRarity,
    pub requirements: Vec<BadgeRequirement>,
    pub created_at: i64,
}
```

3. `src/state/community.rs`:
```rust
#[account]
pub struct CommunityData {
    pub owner: Pubkey,
    pub name: String,
    pub description: String,
    pub members: Vec<Pubkey>,
    pub created_at: i64,
    pub settings: CommunitySettings,
}
```

### 2. Web Application Configuration

#### Update App.tsx
```typescript
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  const network = WalletAdapterNetwork.Testnet;
  const endpoint = useMemo(() => clusterApiUrl('testnet'), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {/* Your app components */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
```

## Testing

### 1. Program Testing
```bash
cd solana-program

# Run tests
anchor test

# Check test coverage
cargo tarpaulin
```

### 2. Web Application Testing
```bash
cd ../web

# Run development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint
```

## Deployment

### 1. Program Deployment
```bash
cd solana-program

# Build for production
anchor build

# Deploy to testnet
anchor deploy --provider.cluster testnet

# Verify deployment
solana program show $PROGRAM_ID
```

### 2. Web Application Deployment
```bash
cd ../web

# Build for production
npm run build

# Test production build locally
npm run preview
```

## Troubleshooting

### Common Issues and Solutions

1. Program Deployment Issues:
   ```bash
   # Check Solana balance
   solana balance

   # Check program status
   solana program show $PROGRAM_ID

   # Check logs
   solana logs $PROGRAM_ID
   ```

2. Web Application Issues:
   ```bash
   # Clear npm cache
   npm cache clean --force

   # Remove node_modules
   rm -rf node_modules
   npm install

   # Check for port conflicts
   lsof -i :3000
   ```

3. Wallet Connection Issues:
   - Clear browser cache
   - Reinstall Phantom wallet
   - Check network settings
   - Verify RPC endpoint

## Maintenance

### 1. Regular Updates
```bash
# Update Rust
rustup update

# Update Solana
solana-install update

# Update Anchor
avm install latest
avm use latest

# Update dependencies
npm update
```

### 2. Backup Procedures
```bash
# Backup program keypair
cp ~/.config/solana/id.json ~/backup/

# Backup environment files
cp .env ~/backup/

# Backup program ID
echo $PROGRAM_ID > ~/backup/program_id.txt
```

## Security

### 1. Key Management
- Store private keys securely
- Use environment variables
- Never commit sensitive data
- Regular key rotation

### 2. Access Control
- Implement proper account validation
- Use PDAs for program accounts
- Validate all user inputs
- Implement proper error handling

### 3. Monitoring
- Set up logging
- Monitor program usage
- Track error rates
- Monitor performance

## Final Checklist

Before going live:
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Backup procedures in place
- [ ] Monitoring set up
- [ ] Error handling implemented
- [ ] User guides created
- [ ] Support channels established
- [ ] Legal compliance verified

## Support Resources

1. Documentation:
   - Solana Docs: https://docs.solana.com
   - Anchor Docs: https://www.anchor-lang.com
   - React Docs: https://reactjs.org

2. Community:
   - Solana Discord
   - Anchor Discord
   - Stack Overflow

3. Tools:
   - Solana Explorer
   - Anchor Explorer
   - Solana Playground

Remember:
- Always test on devnet first
- Keep your keys secure
- Monitor your deployment
- Regular backups
- Stay updated with security patches
- Document all changes
- Maintain good error handling
- Keep dependencies updated 