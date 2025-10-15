"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const allGames = [
  {
    id: 1,
    name: "لعبة الذاكرة السريعة",
    image: "https://images.pexels.com/photos/269851/pexels-photo-269851.jpeg",
    category: "ذاكرة",
    age: "للجميع",
    players: "لاعب واحد",
    difficulty: "سهل",
    icon: "🧠",
  },
  {
    id: 2,
    name: "تحدي الذكاء المنطقي",
    image: "https://images.pexels.com/photos/432722/pexels-photo-432722.jpeg",
    category: "ذكاء",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب",
    icon: "💡",
  },
  {
    id: 3,
    name: "سباق التفكير السريع",
    image: "https://images.pexels.com/photos/270807/pexels-photo-270807.jpeg",
    category: "سرعة بديهة",
    age: "للصغار",
    players: "لاعب واحد",
    difficulty: "متوسط",
    icon: "⏱️",
  },
  {
    id: 4,
    name: "الشطرنج الكلاسيكي",
    image: "https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg",
    category: "ذكاء",
    age: "للجميع",
    players: "لاعبان",
    difficulty: "صعب",
    icon: "♟️",
  },
  {
    id: 5,
    name: "ألغاز الصور",
    image: "https://images.pexels.com/photos/1574717/pexels-photo-1574717.jpeg",
    category: "ألغاز",
    age: "للجميع",
    players: "لاعب واحد",
    difficulty: "سهل",
    icon: "🖼️",
  },
  {
    id: 6,
    name: "سيد الاستراتيجية (Go)",
    image: "https://images.pexels.com/photos/592398/pexels-photo-592398.jpeg",
    category: "استراتيجية",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب جداً",
    icon: "🗺️",
  },
  {
    id: 7,
    name: "متاهة المنطق المتعدد",
    image: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg",
    category: "منطق",
    age: "للكبار",
    players: "لاعب واحد",
    difficulty: "صعب جداً",
    icon: "🤯",
  },
  {
    id: 8,
    name: "سباق الأرقام المتفجرة",
    image: "https://images.pexels.com/photos/4030088/pexels-photo-4030088.jpeg",
    category: "سرعة وذاكرة",
    age: "للجميع",
    players: "لاعب واحد (ضد الذكاء الاصطناعي)",
    difficulty: "صعب",
    icon: "💣",
  },
];

// أيقونات الفلاتر
const getFilterIcon = (filterName) => {
  switch (filterName) {
    case "category":
      return "🧠";
    case "age":
      return "👨‍👩‍👧‍👦";
    case "players":
      return "🎮";
    case "difficulty":
      return "🔥";
    default:
      return "";
  }
};

export default function Home() {
  const [filters, setFilters] = useState({
    category: "",
    age: "",
    players: "",
    difficulty: "",
  });

  const availableCategories = [...new Set(allGames.map((g) => g.category))];
  const availableDifficulties = [...new Set(allGames.map((g) => g.difficulty))];
  const availableAges = [...new Set(allGames.map((g) => g.age))];
  const simplifiedAvailablePlayers = [
    ...new Set(allGames.map((g) => g.players)),
  ].map((p) => p.trim());

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const finalFilteredGames = allGames.filter(
    (game) =>
      (!filters.category || game.category === filters.category) &&
      (!filters.age || game.age === filters.age) &&
      (!filters.players || game.players.includes(filters.players)) &&
      (!filters.difficulty || game.difficulty === filters.difficulty)
  );

  return (
    <div className="min-h-screen p-8 text-white bg-gradient-to-br from-[#030617] via-[#0b1029] to-[#07162d] relative overflow-hidden">
      {/* خلفية نيون متحركة */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(0,255,255,0.15),transparent_70%),radial-gradient(circle_at_70%_60%,rgba(0,100,255,0.2),transparent_70%)] blur-3xl animate-pulse"></div>

      <header className="mb-16 text-center relative z-10">
        <h1 className="mb-4 text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_25px_rgba(0,255,255,0.8)]">
          🧠 منصة ألعاب الذكاء النيوني 💡
        </h1>
        <p className="text-xl text-gray-300 tracking-wide">
          تحديات عقلية تفاعلية بتصميم مستقبلي مشرق ⚡
        </p>
      </header>

      {/* الفلاتر */}
      <div className="grid grid-cols-1 gap-5 p-6 mb-12 rounded-3xl bg-white/10 backdrop-blur-md border border-cyan-600/40 md:grid-cols-4 sm:grid-cols-2 shadow-[0_0_25px_rgba(0,255,255,0.15)]">
        <FilterSelect
          label="نوع اللعبة"
          icon={getFilterIcon("category")}
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          options={availableCategories}
        />
        <FilterSelect
          label="الفئة العمرية"
          icon={getFilterIcon("age")}
          value={filters.age}
          onChange={(e) => handleFilterChange("age", e.target.value)}
          options={availableAges}
        />
        <FilterSelect
          label="عدد اللاعبين"
          icon={getFilterIcon("players")}
          value={filters.players}
          onChange={(e) => handleFilterChange("players", e.target.value)}
          options={simplifiedAvailablePlayers}
        />
        <FilterSelect
          label="مستوى الصعوبة"
          icon={getFilterIcon("difficulty")}
          value={filters.difficulty}
          onChange={(e) => handleFilterChange("difficulty", e.target.value)}
          options={availableDifficulties}
        />
      </div>

      {/* عرض الألعاب */}
      {finalFilteredGames.length === 0 ? (
        <p className="text-center text-gray-400 text-xl mt-20">
          😅 لا توجد ألعاب تطابق الفلاتر المحددة حالياً.
        </p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10">
          {finalFilteredGames.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="group relative overflow-hidden rounded-2xl p-4 bg-gray-900/40 border border-cyan-700/40 hover:border-cyan-400 transition-all duration-500 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)]"
            >
              <div className="relative w-full h-44 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 text-2xl bg-cyan-400 text-black px-3 py-1 rounded-full shadow-lg shadow-cyan-400/50">
                  {game.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors duration-300">
                {game.name}
              </h3>

              <div className="text-sm text-gray-300 space-y-1">
                <p>🏷️ الفئة: {game.category}</p>
                <p>🧑‍🤝‍🧑 اللاعبون: {game.players}</p>
                <p>⚡ الصعوبة: {game.difficulty}</p>
              </div>

              <div className="mt-5 py-2 text-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 transition-transform group-hover:scale-105">
                ▶️ ابدأ التحدي
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// عنصر الفلتر (مظهر زجاجي أنيق)
const FilterSelect = ({ label, icon, value, onChange, options }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/60 border border-cyan-400/30 shadow-inner shadow-cyan-600/20 hover:shadow-cyan-400/40 transition-all">
    <span className="text-2xl text-cyan-300">{icon}</span>
    <select
      className="flex-1 bg-transparent text-white text-lg border-none focus:outline-none cursor-pointer"
      value={value}
      onChange={onChange}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-900 text-white">
          {opt}
        </option>
      ))}
    </select>
  </div>
);
