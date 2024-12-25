"use client";

import Link from "next/link";
import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

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
        <h2 className="text-4xl font-bold text-center mb-8">💡 Motivation Behind This</h2>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-blue-900 leading-relaxed">
            🌟 <span className="font-bold">ZK-Trading-Arena-Game</span> was born out of the need to bridge the gap between trading education and real-world application. By integrating gaming mechanics with decentralized technology, we aim to create a platform that is as engaging as it is educational.
            <br /><br />
            🎯 Our mission is to empower individuals to gain trading skills in a gamified environment, leveraging <span className="font-bold">Zero-Knowledge (ZK) proofs</span> for fairness and trust. The platform also aligns with the OpenCampus mission by combining <span className="font-bold">SocialFi</span> and <span className="font-bold">GameFi</span> to create a scalable model for decentralized education.
          </p>
        </div>
      </section>

      {/* What We Are Solving Section */}
      <section className="py-10 bg-white">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">🛠️ What We Are Solving</h2>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-blue-900 leading-relaxed">
            ZK-Trading-Arena addresses key challenges in trading education and blockchain literacy by providing an innovative platform that combines learning with gamification:
          </p>
          <ul className="list-none mt-8 space-y-4 text-lg text-blue-900 text-left mx-auto">
            <li className="flex items-center">
              <span className="text-2xl mr-3">🎮</span>
              <span>Providing a <span className="font-bold">fun</span>, interactive way to learn trading and blockchain concepts.</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">🛡️</span>
              <span>Enabling players to gain practical experience in a secure, gamified environment.</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">🔒</span>
              <span>Ensuring <span className="font-bold">privacy</span> through Zero-Knowledge proofs, allowing players to verify their profitability without exposing sensitive strategies.</span>
            </li>
            <li className="flex items-center">
              <span className="text-2xl mr-3">💰</span>
              <span>Distributing rewards fairly at the end of each season, with <span className="font-bold">90%</span> of funds collected from entry fees going back to players.</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="py-10 bg-blue-50">
        <h2 className="text-4xl font-bold text-center mb-8 text-blue-900">🤝 Meet the Team</h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center bg-white shadow-lg rounded-lg p-6">
          {/* Left Side: Name and Details */}
          <div className="md:flex-1 text-center md:text-left">
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Dwaipayan Dehury</h3>
            <p className="text-lg text-blue-700 mb-6">Full Stack WEB3 Developer</p>
            <div className="flex justify-center md:justify-start space-x-6">
              {/* Twitter Link */}
              <a
                href="https://twitter.com/dwaipayan01"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition"
              >
                <i className="fab fa-twitter text-2xl"></i>
              </a>
              {/* LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/dwaipayan-dehury-aa0a50166/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 transition"
              >
                <i className="fab fa-linkedin text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Right Side: Profile Picture */}
          <div className="md:flex-1 text-center mt-6 md:mt-0 md:ml-8">
            <img
              src="/images/image.png"
              alt="Dwaipayan Dehury"
              className="w-48 h-48 rounded-lg object-cover shadow-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Navbar */}
      <nav className="bg-blue-100 shadow-lg py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-900">ZK-Trading-Arena</h1>
        <a
          href="https://twitter.com/zkTradingArena"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
        >
          <i className="fab fa-twitter text-2xl"></i>
          <span className="text-lg">@zkTradingArena</span>
        </a>
      </nav>
    </div>
  );
}
