'use client';

import { useState } from "react";
import { useWeb3 } from "../../Web3Context";
import ProofGenerator from "../../ProofGenerator";
import { ethers } from "ethers";

export default function Level1() {
  const { account, zkTradeContract } = useWeb3();
  const [hasEntered, setHasEntered] = useState(false); // State to track if the player entered the game
  const [enteringGame, setEnteringGame] = useState(false); // Entry process status
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(1000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0 }); // Items
  const [showNews, setShowNews] = useState(false); // Toggle news popup
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats

  const entryFee = ethers.utils.parseEther("0.001"); // Entry fee

  const initialPrices = {
    1: { computers: 100, phones: 50, gold: 200 },
    2: { computers: 120, phones: 60, gold: 250 }, // Year 2 prices
  };

  const updatedPrices = {
    computers: 110,
    phones: 70,
    gold: 300,
  };

  const news = {
    1: "Tech boom drives up computer prices! \nExperts recommend investing in tech assets.",
    2: "Gold demand surges globally! \nSafe-haven assets like gold are expected to soar.",
  };

  const handleEnterGame = async () => {
    if (!zkTradeContract || !account) {
      alert("Web3 not initialized. Please connect your wallet!");
      return;
    }

    try {
      setEnteringGame(true);

      // Check if entering the game is required
      const isEnterRequired = await zkTradeContract.checkEnterGameRequiredOrNot(1); // Game Number = 1
      if (!isEnterRequired) {
        alert("You have already entered this game.");
        setHasEntered(true);
        setEnteringGame(false);
        return;
      }

      // Execute enterGame with entry fee
      const tx = await zkTradeContract.enterGame(1, { value: entryFee });
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

  const moveToNextYear = () => {
    setYear(2); // Move to Year 2
  };

  const calculateProfit = () => {
    const initialWorth = 1000; // Initial money
    const finalWorth =
      money +
      positions.computers * updatedPrices.computers +
      positions.phones * updatedPrices.phones +
      positions.gold * updatedPrices.gold;

    const profitPercentage = ((finalWorth - initialWorth) / initialWorth) * 100;
    let stars = 0;
    if (profitPercentage > 40) stars = 3;
    else if (profitPercentage >= 21) stars = 2;
    else if (profitPercentage >= 0) stars = 1;

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
      positions.gold * initialPrices[year].gold
    );
  };

  return (
    <div className="container mx-auto p-4">
      {/* Enter Game Section */}
      {!hasEntered ? (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-6">Welcome to Level 1: Rookie Trader</h1>
          <p className="text-lg mb-4">Test your trading skills and grow your portfolio!</p>
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
        /* Game Logic Section */
        <div>
          {!gameOver ? (
            <>
              <h1 className="text-3xl font-bold mb-4">Level 1: Rookie Trader</h1>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl">Current Year: {year}</p>
                <button
                  onClick={() => setShowNews(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Market News
                </button>
              </div>

              {/* News Popup */}
              {showNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Market News</h2>
                    <p className="mb-6">{news[year]}</p>
                    <button
                      onClick={() => setShowNews(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              {/* Portfolio Value */}
              <p className="mb-4 text-lg font-semibold">
                Current Portfolio Value: ${calculatePortfolioValue().toFixed(2)}
              </p>

              {/* Prices Table */}
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
                        {year === 2 && (
                          <button
                            onClick={() => handleSell(item)}
                            className="bg-yellow-500 text-white px-2 py-1 rounded"
                            disabled={positions[item] <= 0}
                          >
                            Sell
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Year Transition and Calculate Profit */}
              <p className="mb-4">Remaining Money: ${money.toFixed(2)}</p>
              {year === 1 ? (
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
            /* Game Over Summary */
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Game Over</h1>
              <p className="text-lg mb-4">
                Final Portfolio Value: ${finalStats.finalWorth.toFixed(0)}
              </p>
              <p className="text-lg mb-4">
                Stars: {finalStats.stars}⭐️
              </p>
              <ProofGenerator
                initialPrices={initialPrices[1]}
                updatedPrices={updatedPrices}
                positions={positions}
                initialWorth={1000}
                finalWorth={finalStats.finalWorth.toFixed(0)}
                stars={finalStats.stars - 1}
                gameNumber={1}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}