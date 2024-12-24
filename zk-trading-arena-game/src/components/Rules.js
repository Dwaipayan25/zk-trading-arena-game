"use client";

import React, { useState } from "react";
const Rules = () => {
  const [showRules, setShowRules] = useState(false);

  const toggleRules = () => {
    setShowRules(!showRules);
  };

  return (
    <>
      {/* Floating Vertical Button */}
      <div
        className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white font-bold py-1 px-2 cursor-pointer shadow-lg z-50"
        onClick={toggleRules}
      >
        <div className="text-center">R</div>
        <div className="text-center">U</div>
        <div className="text-center">L</div>
        <div className="text-center">E</div>
        <div className="text-center">S</div>
      </div>

      {/* Modal for Rules */}
      {showRules && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleRules}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Game Rules</h2>
            <p className="mb-4">
  1. <b>Connect to the Edu Chain Testnet</b> and have at least <b>0.001 EDU</b> to play any level.<br />
  2. <b>Send 0.001 EDU</b> to play any game in a particular season.<br />
  3. Play the game till the end to complete your session.<br />
  4. <b>Generate the proof</b> and save it to the chain for verification and to gain XP.<br />
  5. To claim XP for a particular game, go to the <b>Challenges</b> section, and select <b>"Claim XP"</b> for that game in the respective season.<br />
  6. At the end of the season, <b>80% of the funds collected</b> from entry fees are distributed among the <b>top 4 participants</b> based on XP.<br />
</p>



            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition w-full"
              onClick={toggleRules}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Rules;
