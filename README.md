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
- Node.js (v18 or higher)
- NPM (v9 or higher)
- MetaMask browser extension
- Access to the Sepolia test network

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

---

## References & Resources

- [EIP-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Hardhat Documentation](https://hardhat.org/)
- MetaMask & Sepolia Faucet: [https://cloud.google.com/application/web3/faucet/ethereum/sepolia](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

---

## Author

Petar Milojević (GitHub: [shugimilo](https://github.com/shugimilo))
