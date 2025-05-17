# OtakuVerse

OtakuVerse is a full-stack web application and blockchain project designed to connect anime fans and creators. It integrates a modern web frontend, a robust Node.js backend, and a custom Solana smart contract, enabling unique on-chain features for its community.
Live Link - https://otaku-verse-coral.vercel.app/
---

##  What is OtakuVerse?

OtakuVerse aims to be a digital hub for otaku culture, providing a platform where users can sign up, join a waitlist, and interact with web3-powered features backed by the Solana blockchain. The project combines a modern user experience with decentralized technology, making it possible to create, own, or interact with digital assets in an anime-focused ecosystem.

---

##  Project Architecture

The repository is structured as a monorepo containing three main components:

```
OtakuVerse/
├── backend/          # Node.js/Express API server (handles authentication, waitlist, webhooks)
├── web/              # Modern web frontend (React/Vite/Typescript/Tailwind)
├── solana-program/   # Solana smart contract (Rust/Anchor)
```

- **Backend:** Provides RESTful APIs, manages users, waitlist, and webhook integrations.
- **Frontend:** Offers the user interface, connects to backend APIs, and interacts with the Solana program.
- **Solana Program:** Implements blockchain logic for on-chain features (digital collectibles, memberships, etc.).

---

## Features

- **User waitlist:** Users can join a waitlist for early access or participation.
- **Webhooks:** Integrates with Clerk for authentication/user management.
- **Solana blockchain integration:** On-chain actions and asset management.
- **Modern web UI:** Built with React, Vite, TypeScript, and Tailwind CSS.
- **Monorepo:** All major components are co-located for easier development and collaboration.

---

## How to Run Locally

### 1. Backend Setup

```bash
cd backend
npm install
# Create a .env file:
echo "MONGODB_URI=your-mongodb-connection-string" > .env
npm run dev
```
- Replace `your-mongodb-connection-string` with your MongoDB Atlas or local URI.

### 2. Web Frontend Setup

```bash
cd web
npm install # or bun install
npm run dev # or bun run dev
```
- Visit [http://localhost:3000](http://localhost:3000) (or as shown in terminal) to view the frontend.

### 3. Solana Program Setup

```bash
cd solana-program
anchor build         # build Solana program
anchor test          # run tests
```
- Requires Rust, Solana CLI, and Anchor to be installed.

---

## API Endpoints

- `POST /api/waitlist` — Add email to waitlist
- `POST /api/clerk-webhook` — Save Clerk user info (for webhooks)

More details can be found in [`backend/README.md`](./backend/README.md).

---

## Contributing

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes
4. Push and open a pull request

---

## License

MIT

---

**Explore each folder for specific README files and additional documentation. For questions or issues, please open an issue or discussion on GitHub!**
