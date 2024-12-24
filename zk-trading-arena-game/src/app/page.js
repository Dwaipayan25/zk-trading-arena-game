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
          <h2>Real World Simulations</h2>
          <p>Engage in Real World market conditions and show your skills!</p>
          <Link href="/real-world-simulations" className="btn">
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
        <div className="feature-card">
          <h2>Scoreboard</h2>
          <p>See where you stand!</p>
          <Link href="/scoreboard" className="btn">
            Scoreboard
          </Link>
        </div>
      </div>

      
    </div>
  );
}
