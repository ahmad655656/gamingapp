"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const allGames = [
  {
    id: 1,
    name: "لعبة الذاكرة السريعة",
    image: "/asset/11.webp",
    category: "ذاكرة",
    age: "للجميع",
    players: "لاعب واحد",
    difficulty: "سهل",
    icon: "🧠",
  },
  {
    id: 2,
    name: "تحدي الذكاء المنطقي",
    image: "/asset/22.webp",
    category: "ذكاء",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب",
    icon: "💡",
  },
  {
    id: 3,
    name: "سباق التفكير السريع",
    image: "/asset/33.webp",
    category: "سرعة بديهة",
    age: "للصغار",
    players: "لاعب واحد",
    difficulty: "متوسط",
    icon: "⏱️",
  },
  {
    id: 4,
    name: "الشطرنج الكلاسيكي",
    image: "/asset/44.webp",
    category: "ذكاء",
    age: "للجميع",
    players: "لاعبان",
    difficulty: "صعب",
    icon: "♟️",
  },
  {
    id: 5,
    name: "ألغاز الصور",
    image: "/asset/55.webp",
    category: "ألغاز",
    age: "للجميع",
    players: "لاعب واحد",
    difficulty: "سهل",
    icon: "🖼️",
  },
  {
    id: 6,
    name: "سيد الاستراتيجية (Go)",
    image: "/asset/66.webp",
    category: "استراتيجية",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب جداً",
    icon: "🗺️",
  },
  {
    id: 7,
    name: "متاهة المنطق المتعدد",
    image: "/asset/77.webp",
    category: "منطق",
    age: "للكبار",
    players: "لاعب واحد",
    difficulty: "صعب جداً",
    icon: "🤯",
  },
  {
    id: 8,
    name: "سباق الأرقام المتفجرة",
    image: "/asset/88.webp",
    category: "سرعة وذاكرة",
    age: "للجميع",
    players: "لاعب واحد (ضد الذكاء الاصطناعي)",
    difficulty: "صعب",
    icon: "💣",
  },
  {
  id: 9,
  name: "غزو العقول: اختبار الذكاء الأعلى",
  image: "/asset/99.webp",
  category: "ذكاء وتحليل",
  age: "للكبار",
  players: "لاعب واحد أو ضد الذكاء الاصطناعي",
  difficulty: "صعب جداً",
  icon: "🧠⚔️",
},
];

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
    <div className="min-h-screen p-8 text-white relative overflow-hidden bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e]">
      {/* تأثيرات ضوء نيون */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[200px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-700/30 blur-[250px] animate-pulse delay-1000"></div>
      </div>

      {/* العنوان الرئيسي */}
      <header className="text-center mb-16 relative z-10">
        <h1 className="md:text-5xl text-3xl font-extrabold bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_35px_rgba(0,255,255,0.7)]">
          🧩 منصة ألعاب الذكاء المتقدمة 💠
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          اختبر قدراتك العقلية في أجواء نيون مذهلة ⚡
        </p>
      </header>

     {/* 🔹 قسم الفلاتر */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14 relative z-10">
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
              className="group relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-gray-900/70 to-gray-800/60 border border-cyan-600/40 hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)] transition-all duration-500"
            >
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-xl">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 text-2xl bg-cyan-400 text-black px-3 py-1 rounded-full shadow-lg shadow-cyan-400/50">
                  {game.icon}
                </div>
              </div>

              <h3 className="text-2xl font-bold text-cyan-300 mb-2 group-hover:text-cyan-100 transition-colors duration-300">
                {game.name}
              </h3>

              <div className="text-sm text-gray-300 space-y-1">
                <p>🏷️ الفئة: {game.category}</p>
                <p>🧑‍🤝‍🧑 اللاعبون: {game.players}</p>
                <p>⚡ الصعوبة: {game.difficulty}</p>
              </div>

              <div className="mt-5 py-2 text-center rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-105">
                ▶️ ابدأ التحدي
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
const FilterSelect = ({ label, icon, value, onChange, options }) => (
  <div className="relative group bg-gradient-to-br from-[#0a1628]/80 to-[#0e223a]/70 border border-cyan-400/30 rounded-2xl p-4 backdrop-blur-lg shadow-[0_0_20px_rgba(0,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-500">
    {/* الأيقونة والعنوان */}
    <div className="flex items-center gap-3 mb-3">
      <span className="text-3xl text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.6)]">
        {icon}
      </span>
      <h4 className="text-lg font-semibold text-cyan-200 tracking-wide">{label}</h4>
    </div>

    {/* القائمة المنسدلة */}
    <select
      className="w-full bg-gray-900/50 border border-cyan-500/40 text-white text-base rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/70 hover:bg-gray-900/70 cursor-pointer transition-all duration-300"
      value={value}
      onChange={onChange}
    >
      <option value="" className="bg-gray-900 text-gray-400">
        اختر {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-gray-900 text-white">
          {opt}
        </option>
      ))}
    </select>

    {/* لمسة ضوء حول البطاقة */}
    <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-cyan-400/40 transition-all duration-500"></div>
  </div>
);

