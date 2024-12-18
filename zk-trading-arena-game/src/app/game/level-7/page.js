'use client';

import { useState } from "react";
import { useWeb3 } from "../../Web3Context";
import ProofGenerator from "../../ProofGenerator";
import { ethers } from "ethers";

export default function Level7() {
  const { account, zkTradeContract } = useWeb3();
  const [hasEntered, setHasEntered] = useState(false); // Track if the player entered the game
  const [enteringGame, setEnteringGame] = useState(false); // Entry process status
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(4000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [loan, setLoan] = useState(0); // Loans taken
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats

  const initialPrices = {
    1: { computers: 300, phones: 200, gold: 500, oil: 400, stocks: 600 },
    2: { computers: 320, phones: 220, gold: 550, oil: 420, stocks: 650 },
    3: { computers: 350, phones: 250, gold: 600, oil: 450, stocks: 700 },
    4: { computers: 380, phones: 280, gold: 650, oil: 480, stocks: 750 },
  };

  const finalPrices = {
    computers: 400,
    phones: 300,
    gold: 700,
    oil: 500,
    stocks: 800,
  };

  const news = {
    1: "Tech demand surges, boosting computer and phone prices.",
    2: "Gold demand rises due to global uncertainty.",
    3: "Oil prices increase steadily with growing demand.",
    4: "Stocks rally as markets stabilize.",
  };

  const entryFee = ethers.utils.parseEther("0.001"); // Entry fee for Level 7

  const handleEnterGame = async () => {
    if (!zkTradeContract || !account) {
      alert("Web3 not initialized. Please connect your wallet!");
      return;
    }

    try {
      setEnteringGame(true);

      // Check if entering the game is required
      const isEnterRequired = await zkTradeContract.checkEnterGameRequiredOrNot(7); // Game Number = 7
      if (!isEnterRequired) {
        alert("You have already entered this game.");
        setHasEntered(true);
        setEnteringGame(false);
        return;
      }

      // Execute enterGame with entry fee
      const tx = await zkTradeContract.enterGame(7, { value: entryFee });
      await tx.wait();

      setHasEntered(true);
      alert("You have successfully entered the game!");
    } catch (error) {
      console.error("Error entering the game:", error);
      alert("Failed to enter the game. Check your wallet and balance.");
    } finally {
      setEnteringGame(false);
    }
  };

  const handleBuy = (item) => {
    if (money >= initialPrices[year][item]) {
      setMoney((prev) => prev - initialPrices[year][item]);
      setPositions((prev) => ({ ...prev, [item]: prev[item] + 1 }));
    }
  };

  const handleSell = (item) => {
    if (positions[item] > 0) {
      setMoney((prev) => prev + initialPrices[year][item]);
      setPositions((prev) => ({ ...prev, [item]: prev[item] - 1 }));
    }
  };

  const takeLoan = (amount) => {
    setLoan((prev) => prev + amount);
    setMoney((prev) => prev + amount);
  };

  const repayLoan = (amount) => {
    if (money >= amount && loan >= amount) {
      setLoan((prev) => prev - amount);
      setMoney((prev) => prev - amount);
    }
  };

  const moveToNextYear = () => {
    if (year < 4) {
      // Apply loan interest (10% annually)
      setLoan((prev) => Math.round(prev * 1.1));
      setYear((prev) => prev + 1);
    }
  };

  const calculateProfit = () => {
    const initialWorth = 4000; // Initial money
    const finalWorth =
      money +
      positions.computers * finalPrices.computers +
      positions.phones * finalPrices.phones +
      positions.gold * finalPrices.gold +
      positions.oil * finalPrices.oil +
      positions.stocks * finalPrices.stocks -
      loan; // Subtract remaining loan

    const profitPercentage = ((finalWorth - initialWorth) / initialWorth) * 100;
    let stars = 0;
    if (profitPercentage >= 60) stars = 3;
    else if (profitPercentage >= 40) stars = 2;
    else if (profitPercentage >= 20) stars = 1;

    setFinalStats({
      finalWorth,
      profitPercentage,
      stars,
    });
    setGameOver(true); // End the game
  };

  const calculatePortfolioValue = () => {
    return (
      money +
      positions.computers * initialPrices[year].computers +
      positions.phones * initialPrices[year].phones +
      positions.gold * initialPrices[year].gold +
      positions.oil * initialPrices[year].oil +
      positions.stocks * initialPrices[year].stocks
    );
  };

  return (
    <div className="container mx-auto p-4">
      {!hasEntered ? (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-6">Welcome to Level 7: Loans and Interest</h1>
          <p className="text-lg mb-4">Manage loans effectively to grow your portfolio!</p>
          <button
            onClick={handleEnterGame}
            className={`bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition ${
              enteringGame && "opacity-50 cursor-not-allowed"
            }`}
            disabled={enteringGame}
          >
            {enteringGame ? "Entering Game..." : "Enter Game"}
          </button>
        </div>
      ) : (
        <div>
          {!gameOver ? (
            <>
              <h1 className="text-3xl font-bold mb-4">Level 7: Loans and Interest</h1>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl">Current Year: {year}</p>
                <p className="text-xl">Loan Balance: ${loan}</p>
              </div>

              <p className="mb-4 text-lg font-semibold">
                Current Portfolio Value: ${calculatePortfolioValue().toFixed(2)}
              </p>

              <table className="w-full text-left mb-6">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Item</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Position</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(initialPrices[year]).map((item) => (
                    <tr key={item}>
                      <td className="border px-4 py-2 capitalize">{item}</td>
                      <td className="border px-4 py-2">${initialPrices[year][item]}</td>
                      <td className="border px-4 py-2">{positions[item]}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleBuy(item)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          disabled={money < initialPrices[year][item]}
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => handleSell(item)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                          disabled={positions[item] <= 0}
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mb-4">Remaining Money: ${money.toFixed(2)}</p>
              <div className="mb-6">
                <button
                  onClick={() => takeLoan(500)}
                  className="bg-blue-600 text-white px-4 py-2 rounded mr-4"
                >
                  Take $500 Loan
                </button>
                <button
                  onClick={() => repayLoan(500)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                  disabled={loan < 500 || money < 500}
                >
                  Repay $500 Loan
                </button>
              </div>

              {year < 4 ? (
                <button
                  onClick={moveToNextYear}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Move to Next Year
                </button>
              ) : (
                <button
                  onClick={calculateProfit}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Calculate Final Score
                </button>
              )}
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Game Over</h1>
              <p className="text-lg mb-4">
                Final Portfolio Value: ${finalStats.finalWorth.toFixed(2)}
              </p>
              <p className="text-lg mb-4">
                Profit Percentage: {finalStats.profitPercentage.toFixed(2)}%
              </p>
              <p className="text-lg mb-4">Stars Earned: {finalStats.stars}⭐️</p>
              <ProofGenerator
                initialWorth={4000}
                finalWorth={finalStats.finalWorth}
                stars={finalStats.stars - 1}
                gameNumber={7}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
