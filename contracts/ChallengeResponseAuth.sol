// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title ChallengeResponseAuth
 * @dev Follows the Sign-In With Ethereum Proposal for Authentication (EIP-4361), as well as 
 * other mentioned proposals, like EIP-191 for a standardized way of handling signed data in
 * contract accounts and externally owned accounts (EOAs).
 */
contract ChallengeResponseAuth is Ownable {
    constructor() Ownable() {}

    // Contract state variables
    mapping(bytes32 => bool) public messageHistory;
    uint256 public constant MESSAGE_TIMEOUT = 5 minutes;

    // Events
    event SuccessfulAuth(address indexed user, bytes32 indexed messageHash, uint256 timestamp);
    
    // Errors
    error MessageNotYetValid();
    error MessageExpired();
    error ExpiryTooLong();
    error InvalidChain();
    error MessageAlreadyUsed();
    error InvalidSignature();

    // SIWE message struct
    struct SIWEMessage {
        string domain;      // The domain or host requesting the sign-in (RFC 3986 authority)
        address address_;   // The Ethereum address performing the sign-in (EOA)
        string statement;   // Optional human-readable statement or purpose of the request
        string uri;         // The URI of the relying party or dapp making the request
        uint256 chainId;    // The Ethereum chain ID for which this message is valid (EIP-155)
        bytes32 nonce;      // Random unique value to prevent replay attacks (8+ alphanumeric chars)
        uint256 issuedAt;   // ISO 8601 timestamp of when the message was generated
        uint256 expiresAt;  // ISO 8601 timestamp of when the message expires (optional)
    }

    /**
     * @notice Computes the EIP-4361 / SIWE message hash for a given message.
     * @dev This hash is what the user signs off-chain, and what the contract
     * uses to verify the signature using EIP-191 conventions.
     * @param message The SIWEMessage struct containing all relevant authentication fields.
     * @return The keccak256 hash of the encoded message.
     */
    function computeHash(SIWEMessage calldata message) public pure returns (bytes32) {
        return keccak256(abi.encode(
            message.domain,
            message.address_,
            message.statement,
            message.uri,
            message.chainId,
            message.nonce,
            message.issuedAt,
            message.expiresAt
        ));
    }

    /**
     * @notice Authenticates a user via a signed EIP-4361 message.
     * @param message Struct containing the SIWE message fields.
     * @param signature The signed message bytes produced by the user's wallet.
     * @return True if authentication succeeds.
     */
    function authenticate(
        SIWEMessage calldata message,
        bytes calldata signature
    ) external returns (bool) {
        // Validation
        if (block.timestamp < message.issuedAt) revert MessageNotYetValid();
        if (block.timestamp > message.expiresAt) revert MessageExpired();
        if (message.expiresAt - message.issuedAt > MESSAGE_TIMEOUT) revert ExpiryTooLong();
        if (block.chainid != message.chainId) revert InvalidChain();

        // Generate message hash
        bytes32 messageHash = computeHash(message);

        // Check whether or not message was already used
        if (messageHistory[messageHash]) revert MessageAlreadyUsed();

        // Verify signature - implementation of EIP-191 (0x19) message prefix
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );
        address signer = ECDSA.recover(ethSignedMessageHash, signature);
        if (signer != message.address_) revert InvalidSignature();

        // Mark message as used
        messageHistory[messageHash] = true;

        emit SuccessfulAuth(message.address_, messageHash, block.timestamp);
        return true;
    }

    /**
     * @dev View function to check if a message hash has already been used
     */
    function isMessageUsed(bytes32 messageHash) external view returns (bool) {
        return messageHistory[messageHash];
    }
}