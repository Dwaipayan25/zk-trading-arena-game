"use client";

import Link from "next/link";
import React from "react";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <section className="text-center py-10 bg-blue-100 text-blue-900">
        <h1 className="text-4xl font-bold mb-4">Welcome to ZK-Trading-Arena-Game</h1>
        <p className="text-lg">
          Dive into the world of blockchain-powered trading! Master strategies, compete in exciting battles, and learn cutting-edge cryptographic concepts while having fun.
        </p>
      </section>

      {/* Features Section */}
      {/* Features Section */}
<section className="py-10">
  <h2 className="text-3xl font-bold text-center mb-8">🌟 Features</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div className="feature-card bg-blue-50 shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold mb-4">📈 Level Up</h2>
      <p className="text-lg mb-6">
        Track your progress and unlock new trading titles as you climb the ranks!
      </p>
      <Link href="/level-up" className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Explore
      </Link>
    </div>
    <div className="feature-card bg-blue-50 shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold mb-4">🌍 Real World Simulations</h2>
      <p className="text-lg mb-6">
        Engage in Real World market conditions and show your skills!
      </p>
      <Link href="/real-world-simulations" className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Fight Now
      </Link>
    </div>
    <div className="feature-card bg-blue-50 shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold mb-4">📚 Tutorials</h2>
      <p className="text-lg mb-6">
        Learn the basics of trading, ZK-proofs, and blockchain in our interactive tutorials.
      </p>
      <Link href="/tutorials" className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Learn More
      </Link>
    </div>
    <div className="feature-card bg-blue-50 shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold mb-4">🏆 Challenges</h2>
      <p className="text-lg mb-6">
        Participate in exciting challenges and test your trading skills!
      </p>
      <Link href="/challenges" className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        Take Challenge
      </Link>
    </div>
    <div className="feature-card bg-blue-50 shadow-lg rounded-lg p-6 text-center transform hover:scale-105 transition duration-300">
      <h2 className="text-2xl font-bold mb-4">📊 Scoreboard</h2>
      <p className="text-lg mb-6">
        See where you stand in the competition!
      </p>
      <Link href="/scoreboard" className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        View Scoreboard
      </Link>
    </div>
  </div>
</section>


      {/* Motivation Section */}
      <section className="py-10 bg-blue-100">
        <h2 className="text-3xl font-bold text-center mb-8">💡 Motivation Behind This</h2>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-blue-900">
            ZK-Trading-Arena-Game was born out of the need to bridge the gap between trading education and real-world application. By integrating gaming mechanics with decentralized technology, we aim to create a platform that is as engaging as it is educational. 
            <br />
            Our mission is to empower individuals to gain trading skills in a gamified environment, leveraging Zero-Knowledge (ZK) proofs for fairness and trust. The platform also aligns with the OpenCampus mission by combining SocialFi and GameFi to create a scalable model for decentralized education.
          </p>
        </div>
      </section>

      {/* What We Are Solving Section */}
      <section className="py-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">🛠️ What We Are Solving</h2>
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-lg text-blue-900">
            ZK-Trading-Arena addresses key challenges in trading education and blockchain literacy:
          </div>
          <ul className="list-disc list-inside mt-4 text-lg text-blue-900 text-left">
            <li>Providing a fun, interactive way to learn trading and blockchain concepts.</li>
            <li>Enabling players to gain practical experience in a secure, gamified environment.</li>
            <li>Ensuring privacy through Zero-Knowledge proofs, allowing players to verify their profitability without exposing sensitive strategies.</li>
            <li>Distributing rewards fairly at the end of each season, with 90% of funds collected from entry fees going back to players.</li>
          </ul>
        </div>
      </section>


    </div>
  );
}
