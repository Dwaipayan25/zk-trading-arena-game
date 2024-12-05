'use client';

import { useState } from "react";

export default function GameTemplate({ gameConfig }) {
  const { initialMoney, initialPrices, news, years } = gameConfig;

  const [year, setYear] = useState(1);
  const [money, setMoney] = useState(initialMoney);
  const [positions, setPositions] = useState({});
  const [showNews, setShowNews] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalStats, setFinalStats] = useState({});

  // Initialize positions dynamically based on items in prices
  if (!Object.keys(positions).length) {
    const initialPositions = {};
    Object.keys(initialPrices[1]).forEach((item) => {
      initialPositions[item] = 0;
    });
    setPositions(initialPositions);
  }

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
    if (year < years) {
      setYear(year + 1);
    }
  };

  const calculateProfit = () => {
    const finalWorth = money + Object.keys(positions).reduce((acc, item) => {
      return acc + positions[item] * initialPrices[years][item];
    }, 0);

    const profitPercentage = ((finalWorth - initialMoney) / initialMoney) * 100;
    let stars = 0;
    if (profitPercentage >= 60) stars = 3;
    else if (profitPercentage >= 40) stars = 2;
    else if (profitPercentage >= 20) stars = 1;

    setFinalStats({ finalWorth, profitPercentage, stars });
    setGameOver(true);
  };

  const calculatePortfolioValue = () => {
    return money + Object.keys(positions).reduce((acc, item) => {
      return acc + positions[item] * initialPrices[year][item];
    }, 0);
  };

  return (
    <div className="container mx-auto p-4">
      {!gameOver ? (
        <>
          <h1 className="text-3xl font-bold mb-4">{`Year ${year}`}</h1>
          <button
            onClick={() => setShowNews(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            View News
          </button>

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

          {/* Remaining Money and Actions */}
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
        /* Game Over Summary */
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Game Over</h1>
          <p className="text-lg mb-4">
            Final Portfolio Value: ${finalStats.finalWorth.toFixed(2)}
          </p>
          <p className="text-lg mb-4">
            Profit Percentage: {finalStats.profitPercentage.toFixed(2)}%
          </p>
          <p className="text-lg mb-4">Stars Earned: {finalStats.stars} Star(s)</p>
        </div>
      )}
    </div>
  );
}
