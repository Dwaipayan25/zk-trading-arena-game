"use client";

import React, { useState } from 'react';
import axios from 'axios';

const ProfitVerifier = () => {
  const [initialBalance, setInitialBalance] = useState('');
  const [finalBalance, setFinalBalance] = useState('');
  const [proofRange, setProofRange] = useState('');
  const [gameNumber, setGameNumber] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [proofDetails, setProofDetails] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setProofDetails(null);

    const data = JSON.stringify({
      meta: {},
      proof_input: {
        initial_balance: parseFloat(initialBalance),
        final_balance: parseFloat(finalBalance),
        proof_range: parseFloat(proofRange),
        game_number: parseInt(gameNumber, 10),
      },
      perform_verify: false,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sindri.app/api/v1/circuit/profit-verifier/prove',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        setResponse(response.data);
        const proofId = response.data.proof_id;

        // Delay the execution of fetching proof details by 5 seconds
        setTimeout(() => {
          const proofConfig = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://sindri.app/api/v1/proof/${proofId}/detail`,
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer sindri_TAgwZ3w2BVc10fzFFpFZnqiWFHlgRKJi_0Gu4',
            },
          };

          axios(proofConfig)
            .then((proofResponse) => {
              setProofDetails(proofResponse.data);
              setLoading(false);
            })
            .catch((error) => {
              setResponse(error.message);
              setLoading(false);
            });
        }, 5000); // 5000 milliseconds = 5 seconds
      })
      .catch((error) => {
        setResponse(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="profit-verifier">
      <h2>Profit Verifier</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Initial Balance:</label>
          <input
            type="number"
            value={initialBalance}
            onChange={(e) => setInitialBalance(e.target.value)}
          />
        </div>
        <div>
          <label>Final Balance:</label>
          <input
            type="number"
            value={finalBalance}
            onChange={(e) => setFinalBalance(e.target.value)}
          />
        </div>
        <div>
          <label>Proof Range:</label>
          <input
            type="number"
            value={proofRange}
            onChange={(e) => setProofRange(e.target.value)}
          />
        </div>
        <div>
          <label>Game Number:</label>
          <input
            type="number"
            value={gameNumber}
            onChange={(e) => setGameNumber(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {response && (
        <div className="response">
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {proofDetails && (
        <div className="proof-details">
          <h3>Proof Details:</h3>
          <pre>{JSON.stringify(proofDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ProfitVerifier;