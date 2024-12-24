"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import ZktradeContractABI from "../app/contracts/Zktrade.json";
import { ethers } from "ethers";

// Create Web3 Context
const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [zkTradeContract, setZkTradeContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [xp, setXp] = useState(0); // Global XP state

  // Connect to MetaMask and load contract
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const signer = provider.getSigner();
    const zkTradeContract = new ethers.Contract(
      "0xf382d4C2948158E49B47C28f616Ad8D5390903ed",
      ZktradeContractABI.abi,
      signer
    );

    setZkTradeContract(zkTradeContract);
  };

  const fetchXP = async () => {
    try {
      if (zkTradeContract && account) {
        const xpValue = await zkTradeContract.getXP(account);
        setXp(Number(xpValue)); // Convert BigNumber to Number
      }
    } catch (error) {
      console.error("Error fetching XP:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchXP();
    }
  }, [account, zkTradeContract]);

  return (
    <Web3Context.Provider value={{ web3Handler, account, zkTradeContract, provider, xp, fetchXP }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for consuming Web3Context
export const useWeb3 = () => useContext(Web3Context);
