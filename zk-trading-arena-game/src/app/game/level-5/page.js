'use client';

import { useState } from "react";
import { useWeb3 } from "../../Web3Context";
import ProofGenerator from "../../ProofGenerator";
import { ethers } from "ethers";

export default function Level5() {
  const { account, zkTradeContract } = useWeb3();
  const [hasEntered, setHasEntered] = useState(false); // State to track if the player entered the game
  const [enteringGame, setEnteringGame] = useState(false); // Entry process status
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(3000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [showNews, setShowNews] = useState(false); // Toggle news popup
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats
  const [tradesLeft, setTradesLeft] = useState(5); // Maximum trades per year
  const [prices, setPrices] = useState({
    1: { computers: 250, phones: 150, gold: 400, oil: 300, stocks: 500 },
    2: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Will be dynamically updated
    3: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Will be dynamically updated
  });

  const entryFee = ethers.utils.parseEther("0.001"); // Entry fee for Level 5

  const finalPrices = {
    computers: 300,
    phones: 200,
    gold: 600,
    oil: 400,
    stocks: 800,
  };

  const news = {
    1: "Tech demand is rising, but gold prices may face volatility.",
    2: "Oil prices are steady, but stocks are on the move.",
    3: "Gold surges as global unrest continues; stocks see slight corrections.",
  };

  const handleEnterGame = async () => {
    if (!zkTradeContract || !account) {
      alert("Web3 not initialized. Please connect your wallet!");
      return;
    }

    try {
      setEnteringGame(true);

      // Check if entering the game is required
      const isEnterRequired = await zkTradeContract.checkEnterGameRequiredOrNot(5); // Game Number = 5
      if (!isEnterRequired) {
        alert("You have already entered this game.");
        setHasEntered(true);
        setEnteringGame(false);
        return;
      }

      // Execute enterGame with entry fee
      const tx = await zkTradeContract.enterGame(5, { value: entryFee });
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

  const generateMarketCrashOrBoom = (year) => {
    const basePrices = { ...prices[1] };
    const multipliers = {
      computers: 1 + (Math.random() > 0.5 ? Math.random() * 0.2 : -Math.random() * 0.3),
      phones: 1 + (Math.random() > 0.5 ? Math.random() * 0.2 : -Math.random() * 0.25),
      gold: 1 + (Math.random() > 0.5 ? Math.random() * 0.3 : -Math.random() * 0.4),
      oil: 1 + (Math.random() > 0.5 ? Math.random() * 0.25 : -Math.random() * 0.3),
      stocks: 1 + (Math.random() > 0.5 ? Math.random() * 0.35 : -Math.random() * 0.3),
    };

    const newPrices = Object.keys(basePrices).reduce((acc, item) => {
      acc[item] = Math.round(basePrices[item] * multipliers[item]);
      return acc;
    }, {});

    setPrices((prev) => ({ ...prev, [year]: newPrices }));
  };

  const calculateEndOfYearTax = () => {
    const portfolioValue = calculatePortfolioValue();
    const tax = portfolioValue * 0.05; // 5% tax
    setMoney((prev) => prev - tax);
  };

  const handleBuy = (item) => {
    if (tradesLeft > 0) {
      if (money >= prices[year][item]) {
        setMoney((prev) => prev - prices[year][item]);
        setPositions((prev) => ({ ...prev, [item]: prev[item] + 1 }));
        setTradesLeft((prev) => prev - 1); // Decrease remaining trades
      }
    } else {
      alert("You have no trades left for this year!");
    }
  };

  const handleSell = (item) => {
    if (tradesLeft > 0) {
      if (positions[item] > 0) {
        setMoney((prev) => prev + prices[year][item]);
        setPositions((prev) => ({ ...prev, [item]: prev[item] - 1 }));
        setTradesLeft((prev) => prev - 1); // Decrease remaining trades
      }
    } else {
      alert("You have no trades left for this year!");
    }
  };

  const moveToNextYear = () => {
    if (year < 3) {
      calculateEndOfYearTax();
      const nextYear = year + 1;
      generateMarketCrashOrBoom(nextYear);
      setYear(nextYear);
      setTradesLeft(5);
    }
  };

  const calculateProfit = () => {
    const initialWorth = 3000; // Initial money
    const finalWorth =
      money +
      positions.computers * finalPrices.computers +
      positions.phones * finalPrices.phones +
      positions.gold * finalPrices.gold +
      positions.oil * finalPrices.oil +
      positions.stocks * finalPrices.stocks;

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
      positions.computers * prices[year].computers +
      positions.phones * prices[year].phones +
      positions.gold * prices[year].gold +
      positions.oil * prices[year].oil +
      positions.stocks * prices[year].stocks
    );
  };

  return (
    <div className="container mx-auto p-4">
      {!hasEntered ? (
        <div className="text-center mt-20">
          <h1 className="text-4xl font-bold mb-6">Welcome to Level 5: Market Crashes and Taxes</h1>
          <p className="text-lg mb-4">
            Navigate market volatility and taxes to maximize your portfolio!
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
              <h1 className="text-3xl font-bold mb-4">Level 5: Market Crashes and Taxes</h1>
              <div className="flex justify-between items-center mb-6">
                <p className="text-xl">Current Year: {year}</p>
                <p className="text-xl">Trades Left: {tradesLeft}</p>
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
                  {Object.keys(prices[year]).map((item) => (
                    <tr key={item}>
                      <td className="border px-4 py-2 capitalize">{item}</td>
                      <td className="border px-4 py-2">${prices[year][item]}</td>
                      <td className="border px-4 py-2">{positions[item]}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleBuy(item)}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                          disabled={money < prices[year][item]}
                        >
                          Buy
                        </button>
                        {year > 1 && (
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

              <p className="mb-4">Remaining Money: ${money.toFixed(2)}</p>
              {year < 3 ? (
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
              <p className="text-lg mb-4">Profit Percentage: {finalStats.profitPercentage.toFixed(2)}%</p>
              <p className="text-lg mb-4">Stars Earned: {finalStats.stars}⭐️</p>
              <ProofGenerator
                initialWorth={3000}
                finalWorth={finalStats.finalWorth}
                stars={finalStats.stars - 1}
                gameNumber={5}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
