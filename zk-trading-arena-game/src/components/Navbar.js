'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "../app/Web3Context";
import "./styles.css";

const Navbar = () => {
  const { web3Handler, account, zkTradeContract ,xp} = useWeb3();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const formatAccount = (account) => {
    return `${account.slice(0, 6)}...${account.slice(-4)}`;
  };
  

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
        <li className={pathname === "/real-world-simulations" ? "active" : ""}>
          <Link href="/real-world-simulations">Real World</Link>
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
