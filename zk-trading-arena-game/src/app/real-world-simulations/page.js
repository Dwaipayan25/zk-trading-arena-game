'use client';

import Link from "next/link";

export default function RealWorldSimulations() {
  const simulations = [
    {
      title: "COVID-19 Market Simulation",
      description: "Navigate the volatility of the markets during the global pandemic. Show how well you can adapt to unpredictable conditions.",
      link: "/simulations/covid-19",
    },
    {
      title: "Russian-Ukraine War Simulation",
      description: "Trade during geopolitical tension and fluctuating energy markets. Prove your skills in navigating crises.",
      link: "/simulations/russian-ukraine-war",
    },
    {
      title: "US Elections Simulation",
      description: "Experience the market swings during a US election period. Make decisions based on economic and political news.",
      link: "/simulations/us-elections",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Real World Simulations</h1>
      <p className="text-lg mb-8 text-center">
        Engage in simulations inspired by real-world market conditions and showcase your trading skills. Can you adapt and thrive during unprecedented events?
      </p>

      <div className="space-y-6">
        {simulations.map((simulation, index) => (
          <div
            key={index}
            className="bg-blue-100 border border-blue-300 rounded-lg shadow-lg p-6 flex justify-between items-center"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">{simulation.title}</h2>
              <p className="text-gray-700">{simulation.description}</p>
            </div>
            <Link href={simulation.link} passHref>
              <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
                Play Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
