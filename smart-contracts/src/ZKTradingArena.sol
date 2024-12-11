// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ZKTradingArena is UUPSUpgradeable, OwnableUpgradeable {
    using ECDSA for bytes32;

    uint256 public entryFee; // Entry fee (in native EDU)
    uint256 public seasonEnd; // End of the current season
    uint256 public totalCollected; // Total EDU collected in the season
    address public relayer;
     // Address of the trusted relayer

    struct GameRecord {
        uint256 highestScore; // Highest score in the game
        uint256 xp;           // XP earned in the game
        uint256 profits;      // Profits achieved in the game
    }

    struct User {
        mapping(string => mapping(uint256 => GameRecord)) gameRecords; // Game type -> Level/ID -> GameRecord
        uint256 totalXP;       // Total XP across all games
        uint256 totalProfits;  // Total profits across all games
    }

    mapping(address => User) private users;
    mapping(bytes32 => bool) public executedTransactions; // Tracks executed meta-transactions
    address[] public userAddresses;

    event GamePlayed(address indexed user, string gameType, uint256 gameId, uint256 feePaid);
    event ProofSubmitted(address indexed user, string gameType, uint256 gameId, uint256 xpEarned, uint256 score);
    event RewardsDistributed(uint256 totalDistributed);
    event GaslessProofSubmitted(address indexed user, string gameType, uint256 gameId, uint256 xpEarned, uint256 score);

    // Initialize the contract
    function initialize(uint256 _entryFee, uint256 _seasonEnd) public initializer {
        __Ownable_init(msg.sender); // Pass the initial owner
        entryFee = _entryFee;
        seasonEnd = _seasonEnd;
    }

    // Set the relayer address
    function setRelayer(address _relayer) external onlyOwner {
        relayer = _relayer;
    }

    // Play the game (users pay native EDU)
    function playGame(string memory gameType, uint256 gameId) external payable {
        require(block.timestamp < seasonEnd, "Season has ended");
        require(msg.value == entryFee, "Incorrect entry fee");

        // Initialize record if it's the user's first time in this game
        if (users[msg.sender].gameRecords[gameType][gameId].highestScore == 0) {
            users[msg.sender].gameRecords[gameType][gameId] = GameRecord(0, 0, 0);
        }

        // Add user to the list if they're new
        if (users[msg.sender].totalXP == 0) {
            userAddresses.push(msg.sender);
        }

        totalCollected += msg.value;

        emit GamePlayed(msg.sender, gameType, gameId, msg.value);
    }

function toEthSignedMessageHash(bytes32 hash) internal pure returns (bytes32) {
    return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
}

    // Submit proof with meta-transaction
function submitProofGasless(
    address user,
    string memory gameType,
    uint256 gameId,
    uint256 profitPercentage,
    uint256 score,
    bytes memory proof,
    bytes memory signature
) external {
    require(msg.sender == relayer, "Only the relayer can call this function");

    // Create the hash of the transaction details
    bytes32 txHash = toEthSignedMessageHash(
        keccak256(
            abi.encodePacked(user, gameType, gameId, profitPercentage, score, proof, address(this))
        )
    );

    // Verify the signature
    address signer = ECDSA.recover(txHash, signature);
    require(signer == user, "Invalid signature");

    // Ensure the transaction hasn't been executed before
    require(!executedTransactions[txHash], "Transaction already executed");
    executedTransactions[txHash] = true;

    // Proof verification logic (dummy in this case)
    require(verifyProof(proof, profitPercentage), "Invalid proof");

    // Update XP and profits for the specific game
    uint256 xpEarned = profitPercentage * 10; // Example formula
    GameRecord storage record = users[user].gameRecords[gameType][gameId];

    record.highestScore = score > record.highestScore ? score : record.highestScore;
    record.xp += xpEarned;
    record.profits += profitPercentage;

    // Update overall stats
    users[user].totalXP += xpEarned;
    users[user].totalProfits += profitPercentage;

    emit GaslessProofSubmitted(user, gameType, gameId, xpEarned, score);
}

    // Verify ZK proof (dummy implementation)
    function verifyProof(bytes memory proof, uint256 profitPercentage) internal pure returns (bool) {
        // Replace with actual ZK proof verification logic
        return profitPercentage <= 100;
    }

    // Distribute rewards at the end of the season
    function distributeRewards() external onlyOwner {
        require(block.timestamp >= seasonEnd, "Season not ended yet");

        uint256 totalDistributed = (totalCollected * 90) / 100; // 90% distribution
        uint256 remainingBalance = totalCollected - totalDistributed;

        // Distribute rewards based on profits
        for (uint256 i = 0; i < userAddresses.length; i++) {
            address user = userAddresses[i];
            uint256 userShare = (users[user].totalProfits * totalDistributed) / totalProfits();
            payable(user).transfer(userShare);
        }

        // Reset for next season
        totalCollected = remainingBalance;
        seasonEnd += 30 days; // Example: Extend season by 30 days

        emit RewardsDistributed(totalDistributed);
    }

    // Calculate total profits
    function totalProfits() internal view returns (uint256) {
        uint256 total = 0;
        for (uint256 i = 0; i < userAddresses.length; i++) {
            total += users[userAddresses[i]].totalProfits;
        }
        return total;
    }

    // Fetch highest score for a specific game and level
    function getHighestScore(address user, string memory gameType, uint256 gameId) external view returns (uint256) {
        return users[user].gameRecords[gameType][gameId].highestScore;
    }

    // Fetch overall stats for a user
    function getOverallStats(address user) external view returns (uint256 totalXP, uint256 totalProfits) {
        totalXP = users[user].totalXP;
        totalProfits = users[user].totalProfits;
    }

    // Upgradeable contract functions
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}