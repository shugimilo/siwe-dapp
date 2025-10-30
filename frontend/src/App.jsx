import React, { useState } from "react";
import { ethers } from "ethers";
import './App.css';
// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x0E8b8be237Ab778C350B096895bB59b416F49506";

// Minimal ABI with the functions/events we need
const CONTRACT_ABI = [
  "function authenticate((string,address,string,string,uint256,bytes32,uint256,uint256), bytes) returns (bool)",
  "event SuccessfulAuth(address indexed user, bytes32 indexed messageHash, uint256 timestamp)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [message, setMessage] = useState(null);
  const [signature, setSignature] = useState(null);
  const [status, setStatus] = useState("");

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask is required!");
      return;
    }
    const prov = new ethers.BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const sign = await prov.getSigner();
    setProvider(prov);
    setSigner(sign);
  }

  function generateNonce() {
    return "0x" + crypto.getRandomValues(new Uint8Array(32))
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
  }

  async function createMessage() {
    const now = Math.floor(Date.now() / 1000);
    const msg = {
      domain: "example.com",
      address_: signer ? await signer.getAddress() : ethers.ZeroAddress,
      statement: "Sign in with Ethereum",
      uri: "https://example.com",
      chainId: 11155111, // Sepolia
      nonce: generateNonce(),
      issuedAt: now,
      expiresAt: now + 300
    };
    setMessage(msg);
  }

  async function signMessage() {
    if (!signer || !message) return;
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ["string","address","string","string","uint256","bytes32","uint256","uint256"],
      [
        message.domain,
        message.address_,
        message.statement,
        message.uri,
        message.chainId,
        message.nonce,
        message.issuedAt,
        message.expiresAt
      ]
    );
    const hash = ethers.keccak256(encoded);
    const sig = await signer.signMessage(ethers.getBytes(hash));
    setSignature(sig);
  }

  async function authenticate() {
    if (!provider || !signer || !message || !signature) return;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    try {
      // Convert SIWEMessage struct into a tuple (array) in the same order as in Solidity
      const messageTuple = [
        message.domain,
        message.address_,
        message.statement,
        message.uri,
        message.chainId,
        message.nonce,
        message.issuedAt,
        message.expiresAt
      ];

      const tx = await contract.authenticate(messageTuple, signature);
      setStatus("Authentication successful!");
      console.log("Tx:", tx);
    } catch (err) {
      console.error(err);
      setStatus("Authentication failed: " + (err.reason || err.message));
    }
  }

  return (
    <div className="app-container">
      {/* LEFT PANEL – Description */}
      <div className="panel description-panel">
        <h1>SIWE Challenge–Response Auth</h1>
        <p>
          A decentralized authentication demo using the
          <strong> Sign-In With Ethereum (EIP-4361) </strong> standard.
          This project showcases how users can verify their identity
          through message signing rather than traditional passwords.
        </p>
        <p>
          Built with <strong>React</strong>, <strong>Hardhat</strong>, and{" "}
          <strong>MetaMask</strong> integration on the <strong>Sepolia</strong> network.
        </p>
      </div>

      {/* CENTER PANEL – Interaction */}
      <div className="panel action-panel">
        {!signer && <button onClick={connectWallet}>Connect Wallet</button>}
        {signer && (
          <>
            <button onClick={createMessage}>Generate Challenge</button>
            <div className="divider" />
            <button onClick={signMessage}>Sign Message</button>
            <div className="divider" />
            <button onClick={authenticate}>Authenticate</button>
          </>
        )}
        <div className="status-text">{status}</div>
      </div>

      {/* RIGHT PANEL – Message */}
      <div className="panel message-panel">
        <h2>SIWE Message</h2>
        {message ? (
          <pre className="message-box">
  {JSON.stringify(message, null, 2)}
          </pre>
        ) : (
          <p className="placeholder">No message generated yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
