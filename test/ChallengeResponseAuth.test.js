const { expect } = require("chai");
const { ethers } = require("hardhat");
// const { hexZeroPad, hexlify, randomBytes, getBytes, hashMessage } = ethers;
const { hexZeroPad, hexlify, getBytes, hashMessage } = require("@ethersproject/bytes")
const crypto = require("crypto");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");

describe("ChallengeResponseAuth", function () {
  let Auth, auth;
  let owner, user, other;

  beforeEach(async () => {
    [owner, user, other] = await ethers.getSigners();
    Auth = await ethers.getContractFactory("ChallengeResponseAuth");
    auth = await Auth.deploy()
    console.log("Contract address:", auth.address);
  });

  // Utility to generate a SIWE-like message
  function generateMessage(overrides = {}) {
    const now = Math.floor(Date.now() / 1000);
    return {
      domain: "example.com",
      address_: overrides.address_ || user.address,
      statement: "Sign-in to Example",
      uri: "https://example.com",
      chainId: overrides.chainId || 31337, // Hardhat default
      // nonce: hexZeroPad(hexlify(randomBytes(8)), 32),
      nonce: "0x" + crypto.randomBytes(32).toString("hex"),
      issuedAt: overrides.issuedAt || now,
      expiresAt: overrides.expiresAt || now + 300, // 5 minutes
    };
  }

  async function signMessage(message, signer) {
    const messageHash = await auth.computeHash(message);
    // const ethSignedMessageHash = ethers.utils.arrayify(
    //  ethers.utils.hashMessage(ethers.utils.arrayify(messageHash))
    // );
    /// const ethSignedMessageHash = hashMessage(getBytes(messageHash));
    // return await signer.signMessage(ethSignedMessageHash);
    /// return await signer.signMessage(getBytes(ethSignedMessageHash));
    const signature = await signer.signMessage(ethers.getBytes(messageHash));
    return signature;
  }

  it("should authenticate a valid message", async function () {
    const message = generateMessage();
    const signature = await signMessage(message, user);

    // await expect(auth.authenticate(message, signature))
    //   .to.emit(auth, "SuccessfulAuth")
    //   .withArgs(user.address, await auth.computeHash(message), await ethers.provider.getBlockNumber());
    await expect(auth.authenticate(message, signature))
        .to.emit(auth, "SuccessfulAuth")
        .withArgs(user.address, await auth.computeHash(message), anyValue);
  });

  it("should reject an invalid signature", async function () {
    const message = generateMessage();
    const signature = await signMessage(message, other); // signed by wrong user

    // await expect(auth.authenticate(message, signature))
    //   .to.be.revertedWith("InvalidSignature");
    await expect(auth.authenticate(message, signature))
        .to.be.revertedWithCustomError(auth, "InvalidSignature");
  });

  it("should prevent replay attacks", async function () {
    const message = generateMessage();
    const signature = await signMessage(message, user);

    await auth.authenticate(message, signature);

    // Reusing same message should fail
    // await expect(auth.authenticate(message, signature))
    //   .to.be.revertedWith("MessageAlreadyUsed");
    await expect(auth.authenticate(message, signature))
        .to.be.revertedWithCustomError(auth, "MessageAlreadyUsed");
  });

  it("should reject expired messages", async function () {
    const now = Math.floor(Date.now() / 1000);
    const message = generateMessage({ issuedAt: now - 600, expiresAt: now - 300 }); // expired 5 min ago
    const signature = await signMessage(message, user);

    // await expect(auth.authenticate(message, signature))
    //   .to.be.revertedWith("MessageExpired");
    
    await expect(auth.authenticate(message, signature))
        .to.be.revertedWithCustomError(auth, "MessageExpired");
  });
});
