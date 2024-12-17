'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useWeb3 } from './Web3Context'; // Web3 Context for zkTradeContract

const ProofGenerator = ({ initialWorth, finalWorth, stars, gameNumber }) => {
  const [proofData, setProofData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onChainLoading, setOnChainLoading] = useState(false);
  const { zkTradeContract } = useWeb3();

  // Function to generate proof via API
  const generateProof = () => {
    setLoading(true);

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

    axios
      .post('https://sindri.app/api/v1/circuit/profit-verifier/prove', data, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
        },
      })
      .then((response) => {
        const proofId = response.data.proof_id;

        // Fetch proof details after a delay
        setTimeout(() => fetchProofDetails(proofId), 5000);
      })
      .catch((error) => {
        console.error("Error generating proof:", error);
        setLoading(false);
      });
  };

  // Fetch proof details using proofId
  const fetchProofDetails = (proofId) => {
    axios
      .get(`https://sindri.app/api/v1/proof/${proofId}/detail`, {
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
        },
      })
      .then((response) => {
        const { proof } = response.data;
        setProofData(proof.proof); // Store proof only
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching proof details:", error);
        setLoading(false);
      });
  };

  // Save proof to blockchain
  const saveProofOnChain = async () => {
    if (!zkTradeContract || !proofData) {
      alert("Contract or proof data is missing.");
      return;
    }

    try {
      setOnChainLoading(true);

      // Convert proof string to bytes
      const proofBytes = ethers.utils.arrayify("0x" + proofData);

      // Call saveGameDetails on the contract
      const tx = await zkTradeContract.saveGameDetails(
        gameNumber,
        stars + 1, // Increment stars as per the contract logic
        proofBytes
      );

      await tx.wait();
      alert("Proof saved on-chain successfully!");
    } catch (error) {
      console.error("Error saving proof on-chain:", error);
      alert("Failed to save proof on-chain.");
    } finally {
      setOnChainLoading(false);
    }
  };

  return (
    <div className="proof-generator">
      {/* Generate Proof Button */}
      <button
        onClick={generateProof}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Generating Proof..." : "Generate Proof"}
      </button>

      {loading && <p>Generating proof...</p>}

      {/* Display Proof */}
      {proofData && (
        <div className="proof-details mt-4">
          <h3 className="text-lg font-bold">Proof</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-x-auto">{proofData}</pre>

          {/* Save Proof On-Chain */}
          <button
            onClick={saveProofOnChain}
            className={`bg-green-500 text-white px-4 py-2 rounded mt-4 ${
              onChainLoading && "opacity-50 cursor-not-allowed"
            }`}
            disabled={onChainLoading}
          >
            {onChainLoading ? "Saving Proof..." : "Save Proof to Blockchain"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProofGenerator;