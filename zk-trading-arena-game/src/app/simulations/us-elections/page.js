'use client';

import { useState } from "react";
import { useWeb3 } from "../../Web3Context";
import ProofGenerator from "../../ProofGenerator";
import { ethers } from "ethers";

export default function USElectionsSimulation() {
  const { account, zkTradeContract } = useWeb3();
  const [hasEntered, setHasEntered] = useState(false); // State to track if the player entered the game
  const [enteringGame, setEnteringGame] = useState(false); // Entry process status
  const [month, setMonth] = useState(1);
  const [money, setMoney] = useState(10000); // Initial amount
  const [positions, setPositions] = useState({
    tesla: 0,
    google: 0,
    microsoft: 0,
    apple: 0,
    oil: 0,
    airline: 0,
    bitcoin: 0,
    ethereum: 0,
    gold: 0,
    s_and_p: 0,
  }); // Assets
  const [showNews, setShowNews] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState({});
  const [prices, setPrices] = useState({
    1: {
      tesla: 800,
      google: 2700,
      microsoft: 300,
      apple: 150,
      oil: 70,
      airline: 30,
      bitcoin: 40000,
      ethereum: 3000,
      gold: 1800,
      s_and_p: 4000,
    },
  });

  const entryFee = ethers.utils.parseEther("0.001"); // Entry fee

  const marketNews = {
    1: "Tech stocks like Tesla and Microsoft rally ahead of debates.",
    2: "Energy markets surge as oil prices rise with policy announcements.",
    3: "Bitcoin and Ethereum gain traction as crypto policy becomes clearer.",
    4: "Gold prices increase as market uncertainty grows.",
    5: "S&P 500 rallies as election results are finalized.",
  };

  const applyRandomFluctuations = (currentPrices) => {
    const newPrices = { ...currentPrices };
    Object.keys(newPrices).forEach((asset) => {
      const randomFactor = 1 + (Math.random() - 0.5) * 0.2; // Random fluctuation ±10%
      newPrices[asset] = Math.round(newPrices[asset] * randomFactor);
    });
    return newPrices;
  };

  const handleEnterGame = async () => {
    if (!zkTradeContract || !account) {
      alert("Web3 not initialized. Please connect your wallet!");
      return;
    }

    try {
      setEnteringGame(true);

      const isEnterRequired = await zkTradeContract.checkEnterGameRequiredOrNot(23); // Game Number = 23
      if (!isEnterRequired) {
        alert("You have already entered this game.");
        setHasEntered(true);
        setEnteringGame(false);
        return;
      }

      const tx = await zkTradeContract.enterGame(23, { value: entryFee });
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

  const handleBuy = (asset) => {
    if (money >= prices[month][asset]) {
      setMoney((prev) => prev - prices[month][asset]);
      setPositions((prev) => ({ ...prev, [asset]: prev[asset] + 1 }));
    }
  };

  const handleSell = (asset) => {
    if (positions[asset] > 0) {
      setMoney((prev) => prev + prices[month][asset]);
      setPositions((prev) => ({ ...prev, [asset]: prev[asset] - 1 }));
    }
  };

  const moveToNextMonth = () => {
    if (month < 5) {
      const newPrices = applyRandomFluctuations(prices[month]);
      setPrices((prev) => ({ ...prev, [month + 1]: newPrices }));
      setMonth((prev) => prev + 1);
    }
  };

  const calculateProfit = () => {
    const initialWorth = 10000;
    const finalWorth =
      money +
      Object.keys(positions).reduce(
        (total, asset) => total + positions[asset] * prices[5][asset],
        0
      );

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
    setGameOver(true);
  };

  const calculatePortfolioValue = () => {
    return (
      money +
      Object.keys(positions).reduce(
        (total, asset) => total + positions[asset] * prices[month][asset],
        0
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      {!hasEntered ? (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-6">US Elections Simulation</h1>
          <p className="text-lg mb-4">
            Navigate market dynamics during the US Elections and showcase your trading skills.
          </p>
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
              <h1 className="text-3xl font-bold mb-4">US Elections Simulation</h1>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl">Current Month: {month}</p>
                <button
                  onClick={() => setShowNews(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Market News
                </button>
              </div>

              {showNews && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">Market News</h2>
                    <p className="mb-6">{marketNews[month]}</p>
                    <button
                      onClick={() => setShowNews(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}

              <p className="mb-4 text-lg font-semibold">
                Current Portfolio Value: ${calculatePortfolioValue().toFixed(2)}
              </p>

              <table className="w-full text-left mb-6">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Asset</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Position</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(prices[month]).map((asset) => (
                    <tr key={asset}>
                      <td className="border px-4 py-2 capitalize">{asset}</td>
                      <td className="border px-4 py-2">${prices[month][asset]}</td>
                      <td className="border px-4 py-2">{positions[asset]}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleBuy(asset)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          disabled={money < prices[month][asset]}
                        >
                          Buy
                        </button>
                        <button
                          onClick={() => handleSell(asset)}
                          className="bg-yellow-500 text-white px-2 py                        -1 rounded"
                          disabled={positions[asset] <= 0}
                        >
                          Sell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mb-4">Remaining Money: ${money.toFixed(2)}</p>
              {month < 5 ? (
                <button
                  onClick={moveToNextMonth}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Move to Next Month
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
                initialPrices={prices[1]}
                updatedPrices={prices[5]}
                positions={positions}
                initialWorth={10000}
                finalWorth={finalStats.finalWorth}
                stars={finalStats.stars - 1}
                gameNumber={23}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

