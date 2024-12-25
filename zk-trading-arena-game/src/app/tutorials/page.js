"use client";

import React from "react";

export default function Tutorials() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-4">📚 Tutorials</h1>
      <p className="text-lg mb-6">
        Learn trading and ZK-proof basics to dominate the game!
      </p>

      <div className="my-8">
        {/* Twitter Embed */}
        <blockquote
          className="twitter-tweet"
          data-lang="en"
          data-dnt="true"
          data-theme="light"
        >
          <a href="https://x.com/zkTradingArena/status/1871941365086773394">
            Tweet Link
          </a>
        </blockquote>
      </div>
      <h2>More coming soon!</h2>
    </div>
  );
}
