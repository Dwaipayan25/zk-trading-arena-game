'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "../app/Web3Context";
import "./styles.css";

const Navbar = () => {
  const { web3Handler, account, zkTradeContract } = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const [xp, setXp] = useState(0); // State for XP
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const formatAccount = (account) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };

  // Fetch XP for the connected account
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

  // Fetch XP when account or contract changes
  useEffect(() => {
    if (account) {
      fetchXP();
    }
  }, [account, zkTradeContract]);

  return (
    <nav className={`navbar ${isOpen ? "active" : ""}`}>
      <Link href="/" className="logo">
        ZK-Trading-Arena-Game
      </Link>
      <button className="toggle-button" onClick={toggleNavbar}>
        ☰
      </button>
      <ul className="nav-links">
        {/* XP Box */}
        {account && (
          <li>
            <div className="xp-box bg-yellow-300 text-black px-4 py-2 rounded-lg font-bold shadow-md">
              Total XP: {xp}
            </div>
          </li>
        )}

        <li className={pathname === "/level-up" ? "active" : ""}>
          <Link href="/level-up">Level Up</Link>
        </li>
        <li className={pathname === "/arena-battles" ? "active" : ""}>
          <Link href="/arena-battles">Arena Battles</Link>
        </li>
        <li className={pathname === "/tutorials" ? "active" : ""}>
          <Link href="/tutorials">Tutorials</Link>
        </li>
        <li className={pathname === "/challenges" ? "active" : ""}>
          <Link href="/challenges">Challenges</Link>
        </li>
        <li>
          <button
            className={`connect-button ${account ? "connected" : ""}`}
            onClick={web3Handler}
          >
            {account ? formatAccount(account) : "Connect Now"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
