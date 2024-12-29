'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../Web3Context'; // Your Web3 context
import { ethers } from 'ethers';

const levels = [
  { gameNumber: 1, title: "Level 1: Rookie Trader", description: "Test your basic trading skills and earn XP." },
  { gameNumber: 2, title: "Level 2: Novice Trader", description: "Advance through harder trading challenges." },
  { gameNumber: 3, title: "Level 3: Apprentice Trader", description: "Prove your mastery of trading strategies." },
  { gameNumber: 4, title: "Level 4: Journeyman Trader", description: "Have you travelled enough?" },
  { gameNumber: 5, title: "Level 5: Strategist", description: "Develop a winning trading strategy." },
  { gameNumber: 6, title: "Level 6: Expert Trader", description: "Showcase your expertise in volatile markets." },
  { gameNumber: 7, title: "Level 7: Master Trader", description: "Master the art of timing and execution." },
  { gameNumber: 8, title: "Level 8: Grandmaster Trader", description: "Compete at the highest level of trading." },
  { gameNumber: 9, title: "Level 9: Elite Trader", description: "Join the elite ranks of trading legends." },
  { gameNumber: 10, title: "Level 10: Legendary Trader", description: "Achieve legendary status in trading." },
  { gameNumber: 11, title: "Level 11: Mythical Trader", description: "Enter the mythical realm of trading greatness." },
  { gameNumber: 12, title: "Level 12: Epic Trader", description: "Make epic trades and extraordinary gains." },
  { gameNumber: 13, title: "Level 13: Heroic Trader", description: "Save the day with heroic trading decisions." },
  { gameNumber: 14, title: "Level 14: Champion Trader", description: "Become the champion in the trading arena." },
  { gameNumber: 15, title: "Level 15: Supreme Trader", description: "Reach supreme levels of trading excellence." },
  { gameNumber: 16, title: "Level 16: Ultimate Trader", description: "Face ultimate challenges and triumph." },
  { gameNumber: 17, title: "Level 17: Godlike Trader", description: "Attain godlike precision in trading." },
  { gameNumber: 18, title: "Level 18: Immortal Trader", description: "Leave an immortal legacy in the trading world." },
  { gameNumber: 19, title: "Level 19: Divine Trader", description: "Trade with divine intuition and skill." },
  { gameNumber: 20, title: "Level 20: Omnipotent Trader", description: "Become the omnipotent force in trading." },
  { gameNumber: 21, title: "COVID-19 Simulation", description: "Navigate volatile markets during the COVID-19 pandemic." },
  { gameNumber: 22, title: "Russia-Ukraine Conflict", description: "Manage assets amid geopolitical tensions and economic uncertainty." },
  { gameNumber: 23, title: "US Elections Simulation", description: "Trade through market shifts driven by US Election events." },
];



const ClaimXP = () => {
  const { zkTradeContract, account, fetchXP } = useWeb3(); // Access smart contract
  const [loadingLevel, setLoadingLevel] = useState(null); // Track which level is processing
  const [successMessage, setSuccessMessage] = useState(null); // Success messages for feedback
  const [errorMessage, setErrorMessage] = useState(null); // Error message for feedback

  const claimXP = async (gameNumber) => {
    if (!zkTradeContract || !account) {
      setErrorMessage("Wallet not connected. Please connect your wallet.");
      return;
    }

    try {
      setLoadingLevel(gameNumber);
      setSuccessMessage(null);
      setErrorMessage(null);

      // Call claimXP function from the smart contract
      const tx = await zkTradeContract.claimXP(gameNumber);
      await tx.wait();

      setSuccessMessage(`XP claimed successfully for Game ${gameNumber}!`);
      fetchXP(); // Refresh XP after claiming
    } catch (error) {
      console.error(`Error claiming XP for Game ${gameNumber}:`, error);
      setErrorMessage(`Failed to claim XP for Game ${gameNumber}.`);
    } finally {
      setLoadingLevel(null);
    }
  };

  return (
    <div className="container mx-auto p-6">

      {/* Feedback Section */}
      {successMessage && (
        <div className="mt-6 text-green-600 text-center font-semibold">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mt-6 text-red-600 text-center font-semibold">
          {errorMessage}
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-center mb-6">Claim XP for Your Levels</h1>

      {/* Display Levels */}
      <div className="space-y-4">
        {levels.map((level) => (
          <div
            key={level.gameNumber}
            className="flex flex-col sm:flex-row items-center justify-between bg-white shadow-md rounded-lg p-4"
          >
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-2">{level.title}</h2>
              <p className="text-gray-600">{level.description}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => claimXP(level.gameNumber)}
                className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition ${
                  loadingLevel === level.gameNumber && 'opacity-50 cursor-not-allowed'
                }`}
                disabled={loadingLevel === level.gameNumber}
              >
                {loadingLevel === level.gameNumber ? "Claiming..." : "Claim XP"}
              </button>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default ClaimXP;
