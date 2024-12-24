'use client';

import { useState } from "react";
import { useWeb3 } from "../Web3Context";
import ProofGenerator from "../ProofGenerator";
import { ethers } from "ethers";

// Helper function to generate levels dynamically
export const generateLevel = (gameNumber, title, description, initialMoney, years, eventMultiplierRange) => {
  return function Level() {
    const { account, zkTradeContract } = useWeb3();
    const [hasEntered, setHasEntered] = useState(false);
    const [enteringGame, setEnteringGame] = useState(false);
    const [year, setYear] = useState(1);
    const [money, setMoney] = useState(initialMoney);
    const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [finalStats, setFinalStats] = useState({});
    const [currentEvent, setCurrentEvent] = useState("Welcome to the market! Stay tuned for the latest updates.");

    const [prices, setPrices] = useState({
      1: { computers: 300, phones: 200, gold: 500, oil: 400, stocks: 600 },
    });

    const randomEvents = [
      { event: "Tech Boom: Computers and phones increase by 25%", target: ["computers", "phones"], multiplier: 1.25 },
      { event: "Market Crash: All prices decrease by 20%", multiplier: 0.8 },
      { event: "Oil Crisis: Oil prices increase by 40%", target: ["oil"], multiplier: 1.4 },
      { event: "Gold Surge: Gold prices increase by 30%", target: ["gold"], multiplier: 1.3 },
    ];

    const entryFee = ethers.utils.parseEther("0.001");

    const handleEnterGame = async () => {
      if (!zkTradeContract || !account) {
        alert("Web3 not initialized. Please connect your wallet!");
        return;
      }

      try {
        setEnteringGame(true);

        const isEnterRequired = await zkTradeContract.checkEnterGameRequiredOrNot(gameNumber);
        if (!isEnterRequired) {
          alert("You have already entered this game.");
          setHasEntered(true);
          setEnteringGame(false);
          return;
        }

        const tx = await zkTradeContract.enterGame(gameNumber, { value: entryFee });
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

    const applyRandomEvent = (updatedYear) => {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setCurrentEvent(event.event);

      const updatedPrices = { ...prices[updatedYear - 1] };

      if (event.target) {
        event.target.forEach((item) => {
          updatedPrices[item] = Math.round(updatedPrices[item] * event.multiplier);
        });
      } else {
        for (const item in updatedPrices) {
          updatedPrices[item] = Math.round(updatedPrices[item] * event.multiplier);
        }
      }

      setPrices((prev) => ({ ...prev, [updatedYear]: updatedPrices }));
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

    const handleBuy = (item) => {
      if (money >= prices[year][item]) {
        setMoney((prev) => prev - prices[year][item]);
        setPositions((prev) => ({ ...prev, [item]: prev[item] + 1 }));
      }
    };

    const handleSell = (item) => {
      if (positions[item] > 0) {
        setMoney((prev) => prev + prices[year][item]);
        setPositions((prev) => ({ ...prev, [item]: prev[item] - 1 }));
      }
    };

    const moveToNextYear = () => {
      if (year < years) {
        const nextYear = year + 1;
        applyRandomEvent(nextYear);
        setYear(nextYear);
      }
    };

    const calculateProfit = () => {
      const initialWorth = initialMoney;
      const dynamicFinalPrices = Object.keys(positions).reduce((acc, item) => {
        const randomMultiplier = 1 + (Math.random() * (eventMultiplierRange[1] - eventMultiplierRange[0]) + eventMultiplierRange[0] - 1);
        acc[item] = Math.round(prices[years][item] * randomMultiplier);
        return acc;
      }, {});

      const finalWorth =
        money +
        positions.computers * dynamicFinalPrices.computers +
        positions.phones * dynamicFinalPrices.phones +
        positions.gold * dynamicFinalPrices.gold +
        positions.oil * dynamicFinalPrices.oil +
        positions.stocks * dynamicFinalPrices.stocks;

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

    return (
      <div className="container mx-auto p-4">
        {!hasEntered ? (
          <div className="text-center mt-20">
            <h1 className="text-4xl font-bold mb-6">{title}</h1>
            <p className="mb-4">{description}</p>
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
                <h1 className="text-3xl font-bold mb-4">{title}</h1>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-xl">Current Year: {year}</p>
                </div>

                {/* Market News Section */}
                <div className="bg-gray-100 p-4 rounded mb-6">
                  <h2 className="text-xl font-bold">Market News</h2>
                  <p>{currentEvent}</p>
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
                {year < years ? (
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
                <p className="text-lg mb-4">
                  Stars Earned: {finalStats.stars} Star(s)
                </p>
                <ProofGenerator
                  initialPrices={prices[1]} 
                  updatedPrices={prices[years]}   
                  positions={positions} 
                  initialWorth={initialMoney}
                  finalWorth={finalStats.finalWorth}
                  stars={finalStats.stars - 1}
                  gameNumber={gameNumber}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };
};

export const Level11 = generateLevel(11, "Level 11: Mythical Trader", "Prove your mythical skills over 5 challenging years.", 6000, 5, [0.7, 1.5]);
export const Level12 = generateLevel(12, "Level 12: Epic Trader", "Show your epic strategies in the toughest trading arena yet.", 7000, 6, [0.7, 1.7]);
export const Level13 = generateLevel(13, "Level 13: Heroic Trader", "Become the hero of the trading world by mastering your portfolio.", 8000, 6, [0.6, 1.8]);
export const Level14 = generateLevel(14, "Level 14: Champion Trader", "Take on the champions and emerge victorious!", 9000, 6, [0.5, 1.9]);
export const Level15 = generateLevel(15, "Level 15: Supreme Trader", "Rise to supreme heights with unparalleled trading acumen.", 10000, 6, [0.4, 2.0]);
export const Level16 = generateLevel(16, "Level 16: Ultimate Trader", "Ultimate challenges await!", 12000, 6, [0.5, 2.1]);
export const Level17 = generateLevel(17, "Level 17: Godlike Trader", "Transcend mortal limits with godlike trading skills.", 15000, 6, [0.4, 2.3]);
export const Level18 = generateLevel(18, "Level 18: Immortal Trader", "Achieve immortality through flawless strategies.", 20000, 6, [0.3, 2.5]);
export const Level19 = generateLevel(19, "Level 19: Divine Trader", "Reach divine mastery and dominate the trading world.", 25000, 6, [0.3, 2.7]);
export const Level20 = generateLevel(20, "Level 20: Omnipotent Trader", "Become the ultimate omnipotent trader, the master of all!", 30000, 6, [0.2, 3.0]);
