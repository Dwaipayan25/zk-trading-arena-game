"use client";

import React, { useState, useEffect, useRef } from "react";
import { useWeb3 } from "../Web3Context";

const Scoreboard = () => {
  const { zkTradeContract } = useWeb3();
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(null); // Cache reference to store the scoreboard data
  const cacheTimestamp = useRef(null); // Timestamp to track cache freshness
  const CACHE_LIFETIME = 60000; // Cache duration in milliseconds (e.g., 60 seconds)

  useEffect(() => {
    if (zkTradeContract) {
      // Check if cache exists and is still valid
      const now = Date.now();
      if (cacheRef.current && cacheTimestamp.current && now - cacheTimestamp.current < CACHE_LIFETIME) {
        // Use cached data
        setScoreboard(cacheRef.current);
      } else {
        // Fetch fresh data if cache is expired or not available
        fetchScoreboard();
      }
    }
  }, [zkTradeContract]);

  const fetchScoreboard = async () => {
    try {
      setLoading(true);

      const players = await zkTradeContract.geAllPlayers();
      const scores = await Promise.all(
        players.map(async (player) => {
          const xp = await zkTradeContract.getXP(player);
          return { address: player, xp: parseInt(xp.toString(), 10) }; // Convert XP from BigNumber
        })
      );

      // Sort players by XP in descending order
      const sortedScores = scores.sort((a, b) => b.xp - a.xp);

      // Update cache
      cacheRef.current = sortedScores;
      cacheTimestamp.current = Date.now();

      // Set the sorted scoreboard data
      setScoreboard(sortedScores);
    } catch (error) {
      console.error("Error fetching scoreboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Scoreboard</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading scoreboard...</p>
      ) : (
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-4 py-2 text-center w-1/12">Rank</th>
              <th className="px-4 py-2 text-left w-7/12">Address</th>
              <th className="px-4 py-2 text-center w-2/12">XP</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((player, index) => (
              <tr
                key={player.address}
                className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
              >
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-left font-mono truncate">
                  {player.address}
                </td>
                <td className="px-4 py-2 text-center">{player.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Scoreboard;
