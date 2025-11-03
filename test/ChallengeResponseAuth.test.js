const { expect } = require("chai");
const { ethers } = require("hardhat");
const { hexlify } = require("ethers");
const crypto = require("crypto");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ChallengeResponseAuth", function () {
  let Auth, auth;
  let owner, user, other;

  beforeEach(async () => {
    [owner, user, other] = await ethers.getSigners();
    Auth = await ethers.getContractFactory("ChallengeResponseAuth");
    auth = await Auth.deploy();
    console.log("Contract address:", auth.target); // v6: .target
  });

  // Utility to generate a SIWE-like message
  async function generateMessage(overrides = {}) {
    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;

    return {
      domain: "example.com",
      address_: overrides.address_ || user.address, // match Solidity struct
      statement: "Sign-in to Example",
      uri: "https://example.com",
      chainId: overrides.chainId || 31337,
      nonce: overrides.nonce || ethers.zeroPadValue(hexlify(crypto.randomBytes(32)), 32), // proper bytes32
      issuedAt: overrides.issuedAt || now,
      expiresAt: overrides.expiresAt || now + 300,
    };
  }

  // Sign a message with a given signer
  async function signMessage(message, signer) {
    const messageHash = await auth.computeHash(message); // bytes32
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    return signature;
  }

  it("should authenticate a valid message", async function () {
    const message = await generateMessage();
    const signature = await signMessage(message, user);

    await expect(auth.authenticate(message, signature))
      .to.emit(auth, "SuccessfulAuth")
      .withArgs(user.address, await auth.computeHash(message), anyValue);
  });

  it("should reject an invalid signature", async function () {
    const message = await generateMessage();
    const signature = await signMessage(message, other); // signed by wrong user

    await expect(auth.authenticate(message, signature))
      .to.be.revertedWithCustomError(auth, "InvalidSignature");
  });

  it("should prevent replay attacks", async function () {
    const message = await generateMessage();
    const signature = await signMessage(message, user);

    await auth.authenticate(message, signature);

    // Reusing same message should fail
    await expect(auth.authenticate(message, signature))
      .to.be.revertedWithCustomError(auth, "MessageAlreadyUsed");
  });

  it("should reject expired messages", async function () {
    const block = await ethers.provider.getBlock("latest");
    const now = block.timestamp;
    const message = await generateMessage({ issuedAt: now - 600, expiresAt: now - 300 }); // expired 5 min ago
    const signature = await signMessage(message, user);

    await expect(auth.authenticate(message, signature))
      .to.be.revertedWithCustomError(auth, "MessageExpired");
  });
});
