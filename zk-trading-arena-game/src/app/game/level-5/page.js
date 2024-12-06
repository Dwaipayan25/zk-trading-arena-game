'use client';

import { useState } from "react";

export default function Level5() {
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(3000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [showNews, setShowNews] = useState(false); // Toggle news popup
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats
  const [tradesLeft, setTradesLeft] = useState(5); // Maximum trades per year

  const initialPrices = {
    1: { computers: 250, phones: 150, gold: 400, oil: 300, stocks: 500 },
    2: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Will be dynamically updated
    3: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Will be dynamically updated
  };

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

  const generateMarketCrashOrBoom = (year) => {
    const basePrices = { ...initialPrices[1] };
    const multipliers = {
      computers: 1 + (Math.random() > 0.5 ? Math.random() * 0.2 : -Math.random() * 0.3),
      phones: 1 + (Math.random() > 0.5 ? Math.random() * 0.2 : -Math.random() * 0.25),
      gold: 1 + (Math.random() > 0.5 ? Math.random() * 0.3 : -Math.random() * 0.4),
      oil: 1 + (Math.random() > 0.5 ? Math.random() * 0.25 : -Math.random() * 0.3),
      stocks: 1 + (Math.random() > 0.5 ? Math.random() * 0.35 : -Math.random() * 0.3),
    };

    const newPrices = Object.keys(basePrices).reduce((acc, item) => {
      acc[item] = Math.round(basePrices[item] * multipliers[item]); // Round to nearest whole number
      return acc;
    }, {});

    setPrices((prev) => ({ ...prev, [year]: newPrices }));
  };

  const calculateEndOfYearTax = () => {
    const portfolioValue = calculatePortfolioValue();
    const tax = portfolioValue * 0.05; // 5% tax
    setMoney((prev) => prev - tax);
  };

  const [prices, setPrices] = useState(initialPrices);

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
      calculateEndOfYearTax(); // Apply end-of-year tax
      const nextYear = year + 1;
      generateMarketCrashOrBoom(nextYear); // Update market prices
      setYear(nextYear);
      setTradesLeft(5); // Reset trades for the new year
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
      positions.computers * prices[year].computers +
      positions.phones * prices[year].phones +
      positions.gold * prices[year].gold +
      positions.oil * prices[year].oil +
      positions.stocks * prices[year].stocks
    );
  };

  return (
    <div className="container mx-auto p-4">
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
              {Object.keys(prices[year]).map((item) => (
                <tr key={item}>
                  <td className="border px-4 py-2 capitalize">{item}</td>
                  <td className="border px-4 py-2">${prices[year][item]}</td>
                  <td className="border px-4 py-2">{positions[item]}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleBuy(item)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      disabled={money < prices[year][item]} // Cannot buy if insufficient funds
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