'use client';

import { useState } from "react";

export default function Level10() {
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(5000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats
  const [currentEvent, setCurrentEvent] = useState(""); // Track the current random event

  const initialPrices = {
    1: { computers: 300, phones: 200, gold: 500, oil: 400, stocks: 600 },
    2: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Dynamically updated
    3: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Dynamically updated
    4: { computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }, // Dynamically updated
  };

  const finalPrices = {
    computers: 450,
    phones: 300,
    gold: 700,
    oil: 500,
    stocks: 800,
  };

  const randomEvents = [
    { event: "Tech Boom: Computers and phones increase by 20%", target: ["computers", "phones"], multiplier: 1.2 },
    { event: "Market Crash: All prices decrease by 15%", multiplier: 0.85 },
    { event: "Oil Crisis: Oil prices increase by 30%", target: ["oil"], multiplier: 1.3 },
    { event: "Gold Surge: Gold prices increase by 25%", target: ["gold"], multiplier: 1.25 },
  ];

  const [prices, setPrices] = useState(initialPrices);

  const applyInflation = () => {
    const updatedPrices = { ...prices[year] };
    for (const item in updatedPrices) {
      updatedPrices[item] = Math.round(updatedPrices[item] * 1.05); // Increase by 5%
    }
    setPrices((prev) => ({ ...prev, [year]: updatedPrices }));
  };

  const applyRandomEvent = () => {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    setCurrentEvent(event.event);

    const updatedPrices = { ...prices[year] };

    if (event.target) {
      event.target.forEach((item) => {
        updatedPrices[item] = Math.round(updatedPrices[item] * event.multiplier);
      });
    } else {
      for (const item in updatedPrices) {
        updatedPrices[item] = Math.round(updatedPrices[item] * event.multiplier);
      }
    }

    setPrices((prev) => ({ ...prev, [year]: updatedPrices }));
  };

  const calculateAnnualTax = () => {
    const portfolioValue = calculatePortfolioValue();
    const tax = Math.round(portfolioValue * 0.1); // 10% tax
    setMoney((prev) => prev - tax);
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
      // Dependency: Selling gold decreases oil prices but increases stock prices
      if (item === "gold") {
        setPrices((prev) => ({
          ...prev,
          [year]: {
            ...prev[year],
            oil: prev[year].oil - 10,
            stocks: prev[year].stocks + 10,
          },
        }));
      }

      setMoney((prev) => prev + prices[year][item]);
      setPositions((prev) => ({ ...prev, [item]: prev[item] - 1 }));
    }
  };

  const moveToNextYear = () => {
    if (year < 4) {
      calculateAnnualTax(); // Apply annual tax
      applyInflation(); // Apply inflation to prices
      setYear((prev) => prev + 1);
      applyRandomEvent(); // Apply a random event
    }
  };

  const calculateProfit = () => {
    const initialWorth = 5000; // Initial money
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

  return (
    <div className="container mx-auto p-4">
      {!gameOver ? (
        <>
          <h1 className="text-3xl font-bold mb-4">Level 10: Inflation and Taxes</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl">Current Year: {year}</p>
            {currentEvent && <p className="text-lg font-semibold">Event: {currentEvent}</p>}
          </div>

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
                    <button
                      onClick={() => handleSell(item)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      disabled={positions[item] <= 0} // Cannot sell if no position
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Remaining Money and Actions */}
          <p className="mb-4">Remaining Money: ${money.toFixed(2)}</p>
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
        </div>
      )}
    </div>
  );
}
