'use client';

import { useState } from "react";

export default function Level9() {
  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(5000); // Initial amount
  const [positions, setPositions] = useState({ computers: 0, phones: 0, gold: 0, oil: 0, stocks: 0 }); // Items
  const [gameOver, setGameOver] = useState(false); // Track if the game is over
  const [finalStats, setFinalStats] = useState({}); // Store final stats

  const initialPrices = {
    1: { computers: 300, phones: 200, gold: 500, oil: 400, stocks: 600 },
    2: { computers: 320, phones: 220, gold: 550, oil: 420, stocks: 650 },
    3: { computers: 350, phones: 250, gold: 600, oil: 450, stocks: 700 },
    4: { computers: 380, phones: 280, gold: 650, oil: 480, stocks: 750 },
  };

  const finalPrices = {
    computers: 450,
    phones: 300,
    gold: 700,
    oil: 500,
    stocks: 800,
  };

  const news = {
    1: "Gold demand rises as global tensions increase.",
    2: "Tech markets surge, boosting computer and phone sales.",
    3: "Oil prices climb steadily with rising demand.",
    4: "Stocks rally as economies stabilize.",
  };

  const randomEvents = [
    { event: "Global Inflation: All prices increase by 15%", multiplier: 1.15 },
    { event: "Market Crash: All prices decrease by 20%", multiplier: 0.8 },
    { event: "Tech Boom: Computers and phones increase by 25%", target: ["computers", "phones"], multiplier: 1.25 },
    { event: "Oil Crisis: Oil prices increase by 30%", target: ["oil"], multiplier: 1.3 },
    { event: "Gold Surge: Gold prices increase by 40%", target: ["gold"], multiplier: 1.4 },
  ];

  const [prices, setPrices] = useState(initialPrices);
  const [currentEvent, setCurrentEvent] = useState("");

  const applyRandomEvent = () => {
    const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
    setCurrentEvent(event.event);

    const newPrices = { ...prices[year] };

    if (event.target) {
      event.target.forEach((item) => {
        newPrices[item] = Math.round(newPrices[item] * event.multiplier);
      });
    } else {
      for (let item in newPrices) {
        newPrices[item] = Math.round(newPrices[item] * event.multiplier);
      }
    }

    setPrices((prev) => ({ ...prev, [year]: newPrices }));
  };

  const calculateHoldingPenalty = () => {
    let penalty = 0;
    Object.values(positions).forEach((quantity) => {
      if (quantity > 5) {
        penalty += (quantity - 5) * 20; // $20 per extra unit
      }
    });
    setMoney((prev) => prev - penalty);
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
    if (year < 4) {
      calculateHoldingPenalty(); // Apply holding penalty
      setYear((prev) => prev + 1);
      applyRandomEvent(); // Apply a random event for the new year
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
          <h1 className="text-3xl font-bold mb-4">Level 9: Random Global Events</h1>
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
