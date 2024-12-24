'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context';

// Component to display positions and percentage changes
const PositionSummary = ({ initialPrices, updatedPrices, positions }) => {
  const calculateChange = (initial, updated) => (((updated - initial) / initial) * 100).toFixed(2);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold">Position Summary</h3>
      <table className="w-full mt-4 text-left">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">% Change</th>
            <th className="border px-4 py-2">Position</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(initialPrices).map((item) => (
            <tr key={item}>
              <td className="border px-4 py-2 capitalize">{item}</td>
              <td className="border px-4 py-2">
                {calculateChange(initialPrices[item], updatedPrices[item])}%
              </td>
              <td className="border px-4 py-2">{positions[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProofGenerator = ({ initialPrices, updatedPrices, positions, initialWorth, finalWorth, stars, gameNumber }) => {
  const [proofData, setProofData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onChainLoading, setOnChainLoading] = useState(false);
  const { account, zkTradeContract } = useWeb3();

  const generateAndSaveProof = async () => {
    if (!zkTradeContract) {
      alert("Contract is not connected.");
      return;
    }

    setLoading(true);

    try {
      // Check if proof for the game already exists
      const existingScoreBigNumber = await zkTradeContract.getGameDetails(account, gameNumber);
      const existingScore = existingScoreBigNumber.toNumber();
      if (existingScore > stars) {
        console.log(existingScore);
        alert("Proof for a similar or higher score is already stored.");
        setLoading(false);
        return;
      }

      // Generate proof
      const data = JSON.stringify({
        meta: {},
        proof_input: {
          initial_balance: initialWorth,
          final_balance: finalWorth,
          proof_range: stars,
          game_number: gameNumber,
        },
        perform_verify: true,
      });

      const response = await axios.post(
        'https://sindri.app/api/v1/circuit/profit-verifier/prove',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
          },
        }
      );

      const proofId = response.data.proof_id;
      if (!proofId) {
        throw new Error("Proof ID is missing in the response.");
      }

      // Wait 4-5 seconds before fetching proof details
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const proofResponse = await axios.get(
        `https://sindri.app/api/v1/proof/${proofId}/detail`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
          },
        }
      );

      const { proof } = proofResponse.data;
      if (!proof?.proof) {
        throw new Error("Proof data is missing.");
      }

      setProofData(proof.proof);

      // Save proof on-chain
      setOnChainLoading(true);
      const proofBytes = ethers.utils.arrayify("0x" + proof.proof);

      const tx = await zkTradeContract.saveGameDetails(gameNumber, stars + 1, proofBytes);
      await tx.wait();

      alert("Proof generated and saved on-chain successfully!");
    } catch (error) {
      console.error("Error generating or saving proof:", error);
      alert("Failed to generate or save proof.");
    } finally {
      setLoading(false);
      setOnChainLoading(false);
    }
  };

  return (
    <div className="proof-generator">
      <PositionSummary
        initialPrices={initialPrices}
        updatedPrices={updatedPrices}
        positions={positions}
      />
      <button
        onClick={generateAndSaveProof}
        className="bg-yellow-500 text-white px-4 py-2 rounded mt-6"
        disabled={loading || onChainLoading}
      >
        {loading || onChainLoading ? "Processing..." : "Generate & Save Proof"}
      </button>

      {proofData && (
        <div className="proof-details mt-4">
          <h3 className="text-lg font-bold">Generated Proof</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{proofData}</pre>
        </div>
      )}

      {loading && <p className="mt-4 text-blue-500">Generating proof...</p>}
      {onChainLoading && <p className="mt-4 text-green-500">Saving proof on-chain...</p>}
    </div>
  );
};

export default ProofGenerator;