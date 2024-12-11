// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ZKTradingRelayer is OwnableUpgradeable, UUPSUpgradeable {
    using ECDSA for bytes32;

    address public tradingArenaContract; // Address of the ZKTradingArena contract

    event TransactionRelayed(address indexed user, bool success, bytes data);

    // Initialize the relayer
    function initialize(address _tradingArenaContract) public initializer {
        __Ownable_init(msg.sender); // Set the initial owner
        tradingArenaContract = _tradingArenaContract;
    }

    // Update the trading arena contract address
    function updateTradingArenaContract(address _newContract) external onlyOwner {
        tradingArenaContract = _newContract;
    }

    function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    // Relay a gasless transaction to the ZKTradingArena contract
    function relayTransaction(
        address user,
        string memory gameType,
        uint256 gameId,
        uint256 profitPercentage,
        uint256 score,
        bytes memory proof,
        bytes memory signature
    ) external onlyOwner {
        // Ensure the contract is properly set
        require(tradingArenaContract != address(0), "Trading Arena contract not set");

        // Create the transaction hash for verification
        bytes32 txHash = toEthSignedMessageHash(
            keccak256(
                abi.encodePacked(user, gameType, gameId, profitPercentage, score, proof, tradingArenaContract)
            )
        );

        // Verify the signature
        address signer = ECDSA.recover(txHash, signature);
        require(signer == user, "Invalid signature");

        // Call the ZKTradingArena contract
        (bool success, bytes memory data) = tradingArenaContract.call(
            abi.encodeWithSignature(
                "submitProofGasless(address,string,uint256,uint256,uint256,bytes,bytes)",
                user,
                gameType,
                gameId,
                profitPercentage,
                score,
                proof,
                signature
            )
        );

        // Emit event for relayed transaction
        emit TransactionRelayed(user, success, data);

        // Revert if the call failed
        require(success, "Relayed transaction failed");
    }

    // Upgradeable contract functions
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}