// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IProfitVerifier {
    function verify(bytes calldata _proof, bytes32[] calldata _publicInputs) external view returns (bool);
}

contract Zktrade {
    uint256 public entryFee = 0.001 ether;
    uint256 public seasonStartTime;
    uint256 public currentSeason;
    address public owner;
    IProfitVerifier public iProfitVerifier;

    struct GameData {
        uint256 score;
        bytes proof;
    }

    // Track entered games per season
    mapping(address => mapping(uint256 => mapping(uint256 => bool))) public enteredGame;

    // Track game details per player, season, and game
    mapping(address => mapping(uint256 => mapping(uint256 => GameData))) public gameDetails;

    // Track XP per player and season
    mapping(address => mapping(uint256 => uint256)) public playerXP;

    // Track proof verification per player, season, gameNumber, and star level
    mapping(address => mapping(uint256 => mapping(uint256 => mapping(uint256 => bool)))) public proofVerified;

    // Address of players who are participating in the current season
    address[] public players;
    // Is a player per season is participating
    mapping(address => mapping(uint256 => bool)) isParticipating;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier seasonActive() {
        require(block.timestamp < seasonStartTime + 30 days, "Season has ended");
        _;
    }

    constructor(address _iprofitVerifier) {
        owner = msg.sender;
        seasonStartTime = block.timestamp;
        currentSeason = 1; // Start with season 1
        iProfitVerifier = IProfitVerifier(_iprofitVerifier);
    }

    // Check if entering the game is required
    function checkEnterGameRequiredOrNot(uint256 gameNumber) public view returns (bool) {
        return !enteredGame[msg.sender][currentSeason][gameNumber];
    }

    // Enter a game
    function enterGame(uint256 gameNumber) external payable seasonActive {
        require(msg.value == entryFee, "Incorrect entry fee");
        require(!enteredGame[msg.sender][currentSeason][gameNumber], "Already entered this game");

        // Mark the player as entered for this game in the current season
        enteredGame[msg.sender][currentSeason][gameNumber] = true;
    }

    // Get game details
    function getGameDetails(address player, uint256 gameNumber) public view returns (uint256) {
        return gameDetails[player][currentSeason][gameNumber].score;
    }

    // Save game details
    function saveGameDetails(uint256 gameNumber, uint256 stars, bytes calldata _proof) public seasonActive {
        require(enteredGame[msg.sender][currentSeason][gameNumber], "Player has not entered this game");
        require(gameDetails[msg.sender][currentSeason][gameNumber].score < stars, "New score must be higher");
        
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[1] = bytes32(gameNumber); // Game number as bytes32
        publicInputs[0] = bytes32(stars - 1);  // Proof range as bytes32 (stars - 1)

        require(iProfitVerifier.verify(_proof,publicInputs), "Proof is rejected");

        uint256 previousStars = gameDetails[msg.sender][currentSeason][gameNumber].score;

        // Adjust XP if proof for previous stars was verified
        if (proofVerified[msg.sender][currentSeason][gameNumber][previousStars]) {
            uint256 xpToReduce = previousStars * 10; // 1 star = 10 XP
            playerXP[msg.sender][currentSeason] -= xpToReduce;
            proofVerified[msg.sender][currentSeason][gameNumber][previousStars] = false;
        }

        // Update game details
        gameDetails[msg.sender][currentSeason][gameNumber] = GameData(stars, _proof);
    }

    // Claim XP for a specific game and star level
    function claimXP(uint256 gameNumber) public seasonActive {
        GameData memory gameData = gameDetails[msg.sender][currentSeason][gameNumber];
        uint256 stars = gameData.score;
        require(stars > 0, "No score available to claim XP");

        // Ensure XP is not already claimed for this star level
        require(!proofVerified[msg.sender][currentSeason][gameNumber][stars], "XP already claimed for this score");

        // Construct public inputs dynamically
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[1] = bytes32(gameNumber); // Game number as bytes32
        publicInputs[0] = bytes32(stars - 1);  // Proof range as bytes32 (stars - 1)

        // Verify the proof using IProfitVerifier
        require(iProfitVerifier.verify(gameData.proof, publicInputs), "Proof is invalid");

        // Grant XP based on stars
        uint256 xpPoints = stars * 10; // 1 star = 10 XP, 2 stars = 20 XP, 3 stars = 30 XP
        playerXP[msg.sender][currentSeason] += xpPoints;

        // Mark proof as verified for the current star level
        proofVerified[msg.sender][currentSeason][gameNumber][stars] = true;
        if(!isParticipating[msg.sender][currentSeason]){
            players.push(msg.sender);
            isParticipating[msg.sender][currentSeason]=true;
        }
    }

    // Get XP for a player in the current season
    function getXP(address player) public view returns (uint256) {
        return playerXP[player][currentSeason];
    }

    function geAllPlayers() public view returns (address[] memory) {
        return players;
    }

    // Reset season
    function resetSeason() public onlyOwner {
        require(block.timestamp >= seasonStartTime + 30 days, "Season is still active");
        require(players.length > 3, "No players to distribute rewards");
        uint256 totalCollectedFees = address(this).balance;

        require(totalCollectedFees > 0, "No rewards to distribute");

        uint256 ownerReward = (totalCollectedFees * 20) / 100;
        uint256 rewardPool = totalCollectedFees - ownerReward;
        uint256[4] memory rewards = [
            (rewardPool * 40) / 100, // 40% for first place
            (rewardPool * 30) / 100, // 30% for second place
            (rewardPool * 20) / 100, // 20% for third place
            (rewardPool * 10) / 100  // 10% for fourth place
        ];

        address[4] memory topPlayers = getTopPlayers();

        for (uint256 i = 0; i < 4; i++) {
            if (topPlayers[i] != address(0) && topPlayers[i].code.length == 0) {
                (bool sent, ) = payable(topPlayers[i]).call{value: rewards[i], gas: 2300}("");
                require(sent, "Failed to send reward");
            }
        }

        (bool ownerSent, ) = payable(owner).call{value: ownerReward}("");
        require(ownerSent, "Failed to send owner reward");

        delete players; // Reset players
        currentSeason++;
        seasonStartTime = block.timestamp;
    }

    function getTopPlayers() internal view returns (address[4] memory) {
        address[4] memory topPlayers;
        uint256[4] memory topXP;

        // Iterate through all players to find the top 4 based on XP
        for (uint256 i = 0; i < players.length; i++) {
            address player = players[i];
            uint256 xp = playerXP[player][currentSeason];

            for (uint256 j = 0; j < 4; j++) {
                if (xp > topXP[j]) {
                    // Shift lower-ranked players down
                    for (uint256 k = 3; k > j; k--) {
                        topPlayers[k] = topPlayers[k - 1];
                        topXP[k] = topXP[k - 1];
                    }

                    // Insert the new top player
                    topPlayers[j] = player;
                    topXP[j] = xp;
                    break;
                }
            }
        }

        return topPlayers;
    }
}