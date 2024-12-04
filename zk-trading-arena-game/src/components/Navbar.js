"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./styles.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState(null);
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const connectMetaMask = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log('MetaMask connected');
      } catch (error) {
        console.error('User rejected the request');
      }
    } else {
      console.error('MetaMask is not installed');
    }
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
            onClick={connectMetaMask}
          >
            {account ? formatAccount(account) : "Connect Now"}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;