'use client';

import React, { useState } from 'react';
import { useWeb3 } from '../Web3Context'; // Your Web3 context
import { ethers } from 'ethers';

const levels = [
  { gameNumber: 1, title: "Level 1: Rookie Trader", description: "Test your basic trading skills and earn XP." },
  { gameNumber: 2, title: "Level 2: Intermediate Trader", description: "Advance through harder trading challenges." },
  { gameNumber: 3, title: "Level 3: Pro Trader", description: "Prove your mastery of trading strategies." },
];

const ClaimXP = () => {
  const { zkTradeContract, account } = useWeb3(); // Access smart contract
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
    } catch (error) {
      console.error(`Error claiming XP for Game ${gameNumber}:`, error);
      setErrorMessage(`Failed to claim XP for Game ${gameNumber}.`);
    } finally {
      setLoadingLevel(null);
    }
  };

  return (
    <div className="container mx-auto p-6">
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
    </div>
  );
};

export default ClaimXP;
