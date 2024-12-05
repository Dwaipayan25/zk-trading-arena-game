'use client';

import { useState } from "react";

export default function Level4() {
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(2500); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [showNews, setShowNews] = useState(false); // Toggle news popup
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats

  const initialPrices = {
    1: { computers: 200, phones: 100, gold: 300, oil: 150, stocks: 400 },
    2: { computers: 220, phones: 120, gold: 350, oil: 180, stocks: 450 },
    3: { computers: 250, phones: 140, gold: 400, oil: 200, stocks: 500 },
  };

  const finalPrices = {
    computers: 300,
    phones: 180,
    gold: 500,
    oil: 300,
    stocks: 700,
  };

  const news = {
    1: "Increased tech demand raises computer and phone prices.",
    2: "Gold prices stabilize, but oil demand rises.",
    3: "Stocks rally as tech markets surge.",
  };

  const calculateHoldingPenalty = () => {
    let penalty = 0;
    Object.values(positions).forEach((quantity) => {
      if (quantity > 3) {
        penalty += (quantity - 3) * 10; // $10 per extra item
      }
    });
    setMoney((prev) => prev - penalty);
  };

  const handleBuy = (item) => {
    const dependencyEffect = item === 'stocks' ? 10 : 0; // Buying stocks increases oil price
    const newPrice = initialPrices[year][item] + dependencyEffect;

    if (money >= newPrice) {
      setMoney((prev) => prev - newPrice);
      setPositions((prev) => ({ ...prev, [item]: prev[item] + 1 }));

      // Update dependent prices
      if (item === 'stocks') {
        setPrices((prev) => ({
          ...prev,
          [year]: { ...prev[year], oil: prev[year].oil + 10 },
        }));
      }
    }
  };

  const handleSell = (item) => {
    if (positions[item] > 0) {
      setMoney((prev) => prev + initialPrices[year][item]);
      setPositions((prev) => ({ ...prev, [item]: prev[item] - 1 }));
    }
  };

  const moveToNextYear = () => {
    if (year < 3) {
      calculateHoldingPenalty(); // Apply holding penalty
      setYear((prev) => prev + 1); // Move to next year
    }
  };

  const calculateProfit = () => {
    const initialWorth = 2500; // Initial money
    const finalWorth =
      money +
      positions.computers * finalPrices.computers +
      positions.phones * finalPrices.phones +
      positions.gold * finalPrices.gold +
      positions.oil * finalPrices.oil +
      positions.stocks * finalPrices.stocks;

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
      {!gameOver ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Level 4: Dependencies and Penalties</h1>
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
                      disabled={money < initialPrices[year][item]} // Cannot buy if insufficient funds
                    >
                      Buy
                    </button>
                    {year > 1 && (
                      <button
                        onClick={() => handleSell(item)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        disabled={positions[item] <= 0} // Cannot sell if no position
                      >
                        Sell
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Remaining Money and Actions */}
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
        /* Game Over Summary */
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
          <h2 className="text-xl font-bold">Final Prices:</h2>
          <ul className="list-disc list-inside">
            {Object.keys(finalPrices).map((item) => (
              <li key={item} className="capitalize">
                {item}: ${finalPrices[item]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
