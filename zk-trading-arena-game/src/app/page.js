"use client";

import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="container">
      <h1>Welcome to ZK-Trading-Arena-Game</h1>
      <p>
        Dive into the world of blockchain-powered trading! Master strategies, compete in exciting battles, and learn cutting-edge cryptographic concepts while having fun.
      </p>

      {/* Features Section */}
      <div className="features">
        <div className="feature-card">
          <h2>Level Up</h2>
          <p>Track your progress and unlock new trading titles as you climb the ranks!</p>
          <Link href="/level-up" className="btn">
            Explore
          </Link>
        </div>
        <div className="feature-card">
          <h2>Arena Battles</h2>
          <p>Compete in head-to-head trading duels and prove your skills!</p>
          <Link href="/arena-battles" className="btn">
            Fight Now
          </Link>
        </div>
        <div className="feature-card">
          <h2>Tutorials</h2>
          <p>Learn the basics of trading, ZK-proofs, and blockchain in our interactive tutorials.</p>
          <Link href="/tutorials" className="btn">
            Learn More
          </Link>
        </div>
        <div className="feature-card">
          <h2>Challenges</h2>
          <p>Participate in exciting challenges and test your trading skills!</p>
          <Link href="/challenges" className="btn">
            Take Challenge
          </Link>
        </div>
      </div>

      {/* Rules Section */}
      <div className="rules-section">
        <h2>Rules</h2>
        <div className="rules-box">
          <ol>
            <li>Send <strong>0.001 EDU</strong> to play any game in a particular season.</li>
            <li>Play the game till the end to complete your session.</li>
            <li>
              Generate the proof and save it to the chain for verification and to gain XP.
            </li>
            <li>
              To claim XP for a particular game, go to the <strong>Challenges</strong> section, and select 
              <strong> "Claim XP"</strong> for that game in the respective season.
            </li>
            <li>
              At the end of the season, <strong>80% of the funds</strong> collected from entry fees are distributed among the top 
              <strong> 4 participants</strong> based on XP.
            </li>
          </ol>
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        .rules-section {
          margin-top: 2rem;
        }
        .rules-box {
          border: 2px solid #0070f3;
          border-radius: 8px;
          padding: 1rem;
          background-color: #f0f8ff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        ol {
          padding-left: 1.5rem;
        }
        li {
          margin-bottom: 0.5rem;
        }
        .btn {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #0070f3;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          transition: background-color 0.3s;
        }
        .btn:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
}
