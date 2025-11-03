# Sign-In with Ethereum (SIWE) DApp

A decentralized authentication application demonstrating how users can securely sign in to a web app using Ethereum wallets and smart contracts on the Sepolia test network, without ever exposing their private keys. This project showcases blockchain-based identity verification and challenge–response authentication using the [EIP-4361 Sign-In with Ethereum standard](https://eips.ethereum.org/EIPS/eip-4361).

---

## Key Features

- **Secure Ethereum Authentication:** Users authenticate via MetaMask and sign messages to prove ownership of externally owned accounts (EOAs) without exposing private keys.  
- **Smart Contract Logging:** Records successful authentications with user addresses and timestamps on the blockchain.  
- **Optimized Contracts:** Smart contracts are designed with gas efficiency and memory usage in mind.  
- **Hardhat Tests:** Ensures contract integrity and correct verification of valid and invalid signatures, nonce usage, and time-limited challenges.  
- **React Frontend with Vite:** Simple and responsive UI with three columns: project description, interactive buttons, and real-time authentication messages.  

---

## Tech Stack

- **Smart Contracts:** Solidity  
- **Development Framework:** Hardhat  
- **Frontend:** React + Vite  
- **Blockchain Interaction:** Ethers.js  
- **Environment:** Node.js, NPM, NPX  
- **IDE:** VS Code (with WSL on Windows)  

---

## Setup & Installation

### Prerequisites
- Node.js (v20.19+ recommended, or ≥ v22.12)
- NPM (v9 or higher)
- MetaMask browser extension
- Access to the Sepolia test network
- (Optional, for running Hardhat tests) `.env` file containing a private key for your MetaMask account on Sepolia

### Optional `.env` File for Testing

To run tests that interact with the Sepolia blockchain, you can create a `.env` file in the root of the repository:

```text
SEPOLIA_PRIVATE_KEY=your_metamask_private_key_here
INFURA_API_KEY=your_infura_project_id_here
```

- SEPOLIA_PRIVATE_KEY — your account private key (only for testing; never commit this file)
- INFURA_API_KEY — optional, if you want to connect via Infura instead of a local node

Once the .env file is in place, Hardhat tests can use it to send transactions on Sepolia.

⚠️ Note: You do not need this file to run the frontend. The frontend uses MetaMask to sign messages locally and doesn’t require your private key.

### Getting Your Own Infura API Key

1. Go to [Infura](https://infura.io) and sign up for a free account.
2. After verifying your email, log in to the dashboard.
3. Click “Create New Project”.
4. Give your project a name (e.g., SIWE-DApp-Test).
5. After creating it, open the project and copy the Project ID — this is your API key.
6. Use this Project ID in your .env file like so:

Follow these steps to run the project locally:

1. **Clone the repository:**
```bash
git clone https://github.com/shugimilo/siwe-dapp.git
cd siwe-dapp
```
2. **Install dependencies:**
```bash
npm install
cd frontend
npm install
cd ..
```
3. **Compile smart contracts:**
```bash
npx hardhat compile
```
4. **Run Hardhat tests:**
```bash
npx hardhat test
```
5. **Start the frontend:**
```bash
cd frontend
npm run dev
```
6. **Open in browser:**
Visit the address shown in the terminal (usually http://localhost:5173) and ensure MetaMask is installed and connected to the Sepolia test network.

---

## Usage Instructions

1. Open the app in your browser.
2. Follow the on-screen instructions to connect your MetaMask wallet.
3. Click the sequential buttons to sign messages and authorize transactions.
3. Observe authentication messages displayed in the third column of the UI, following EIP-4361 and EIP-191 standards.

---

## Testing

- One test is included in the test/ directory.
- Run with:
- ```bash
  npx hardhat test
  ```
- Covers: valid authentications, invalid signatures, nonce replay protection, and time-limited challenges.

⚠️ To run tests that send transactions on Sepolia, make sure you’ve created a .env file as described in the [Setup & Installation](#optional-env-file-for-testing) section, containing your SEPOLIA_PRIVATE_KEY and optional INFURA_API_KEY.

---

## References & Resources

- [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Hardhat Documentation](https://hardhat.org/)
- [Hardhat Environment Variables Docs](https://hardhat.org/docs/reference/configuration#environment-variables)
- [MetaMask & Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
- [Infura Documentation](https://infura.io/docs)

---

## Author

Petar Milojević (GitHub: [shugimilo](https://github.com/shugimilo))
