import Link from "next/link";

export default function LevelUp() {
  const levels = [
    { level: 1, title: "Rookie Trader" },
    { level: 2, title: "Novice Trader" },
    { level: 3, title: "Apprentice Trader" },
    { level: 4, title: "Journeyman Trader" },
    { level: 5, title: "Strategist" },
    { level: 6, title: "Expert Trader" },
    { level: 7, title: "Master Trader" },
    { level: 8, title: "Grandmaster Trader" },
    { level: 9, title: "Elite Trader" },
    { level: 10, title: "Legendary Trader" },
    { level: 11, title: "Mythical Trader" },
    { level: 12, title: "Epic Trader" },
    { level: 13, title: "Heroic Trader" },
    { level: 14, title: "Champion Trader" },
    { level: 15, title: "Supreme Trader" },
    { level: 16, title: "Ultimate Trader" },
    { level: 17, title: "Godlike Trader" },
    { level: 18, title: "Immortal Trader" },
    { level: 19, title: "Divine Trader" },
    { level: 20, title: "Omnipotent Trader" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Level Up</h1>
      <p className="mb-6">Track your progress and unlock new trading titles.</p>

      {/* Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {levels.map((level) => (
          <Link key={level.level} href={`/game/level-${level.level}`} passHref>
            <div
              className="p-4 border rounded-lg text-center cursor-pointer bg-blue-300 text-blue-900 border-blue-400"
            >
              <h2 className="text-xl font-bold">Level {level.level}</h2>
              <p className="text-black">{level.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
