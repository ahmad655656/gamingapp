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
  },
  {
    id: 2,
    name: "تحدي الذكاء المنطقي",
    image: "https://images.pexels.com/photos/432722/pexels-photo-432722.jpeg",
    category: "ذكاء",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب",
  },
  {
    id: 3,
    name: "سباق التفكير السريع",
    image: "https://images.pexels.com/photos/270807/pexels-photo-270807.jpeg",
    category: "سرعة بديهة",
    age: "للصغار",
    players: "لاعب واحد",
    difficulty: "متوسط",
  },
  {
    id: 4,
    name: "الشطرنج الكلاسيكي",
    image: "https://images.pexels.com/photos/260024/pexels-photo-260024.jpeg",
    category: "ذكاء",
    age: "للجميع",
    players: "لاعبان",
    difficulty: "صعب",
  },
  {
    id: 5,
    name: "ألغاز الصور",
    image: "https://images.pexels.com/photos/1574717/pexels-photo-1574717.jpeg",
    category: "ألغاز",
    age: "للجميع",
    players: "لاعب واحد",
    difficulty: "سهل",
  },

  // 🌟 الإضافة الجديدة 1: سيد الاستراتيجية (Go)
  {
    id: 6,
    name: "سيد الاستراتيجية (Go)",
    image: "https://images.pexels.com/photos/592398/pexels-photo-592398.jpeg",
    category: "استراتيجية",
    age: "للكبار",
    players: "لاعبان",
    difficulty: "صعب جداً", // إضافة مستوى صعوبة جديد
  },

  // 🤯 الإضافة الجديدة 2: متاهة المنطق المتعدد
  {
    id: 7,
    name: "متاهة المنطق المتعدد",
    image: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg",
    category: "منطق",
    age: "للكبار",
    players: "لاعب واحد",
    difficulty: "صعب جداً", // إضافة مستوى صعوبة جديد
  },
];

export default function Home() {
  const [filters, setFilters] = useState({
    category: "",
    age: "",
    players: "",
    difficulty: "",
  });

  const filteredGames = allGames.filter(
    (game) =>
      (!filters.category || game.category === filters.category) &&
      (!filters.age || game.age === filters.age) &&
      (!filters.players || game.players === filters.players) &&
      (!filters.difficulty || game.difficulty === filters.difficulty)
  );

  // استخراج قائمة الفئات و الصعوبات المتاحة بعد الإضافة
  const availableCategories = [...new Set(allGames.map(g => g.category))];
  const availableDifficulties = [...new Set(allGames.map(g => g.difficulty))];

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700">
      <header className="mb-10 text-center">
        <h1 className="mb-2 text-4xl font-extrabold drop-shadow-lg">🧩 ألعاب الذكاء</h1>
        <p className="text-lg text-gray-200">
          اختبر قدراتك الفكرية وتحدّ أصدقاءك في ألعاب ذكاء مناسبة للكبار والصغار!
        </p>
      </header>

      {/* 🎛️ الفلاتر */}
      <div className="grid grid-cols-1 gap-4 p-4 mb-8 shadow-lg bg-white/10 backdrop-blur-md rounded-2xl md:grid-cols-4 sm:grid-cols-2">
        {/* فئة اللعبة */}
        <select
          className="p-2 text-white border border-gray-700 rounded-lg bg-gray-900/50 focus:ring-2 focus:ring-cyan-400"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">🧠 نوع اللعبة</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* الفئة العمرية */}
        <select
          className="p-2 text-white border border-gray-700 rounded-lg bg-gray-900/50 focus:ring-2 focus:ring-cyan-400"
          value={filters.age}
          onChange={(e) => setFilters({ ...filters, age: e.target.value })}
        >
          <option value="">👨‍👩‍👧‍👦 الفئة العمرية</option>
          <option value="للصغار">للصغار</option>
          <option value="للكبار">للكبار</option>
          <option value="للجميع">للجميع</option>
        </select>

        {/* عدد اللاعبين */}
        <select
          className="p-2 text-white border border-gray-700 rounded-lg bg-gray-900/50 focus:ring-2 focus:ring-cyan-400"
          value={filters.players}
          onChange={(e) => setFilters({ ...filters, players: e.target.value })}
        >
          <option value="">🎮 عدد اللاعبين</option>
          <option value="لاعب واحد">لاعب واحد</option>
          <option value="لاعبان">لاعبان</option>
        </select>

        {/* مستوى الصعوبة */}
        <select
          className="p-2 text-white border border-gray-700 rounded-lg bg-gray-900/50 focus:ring-2 focus:ring-cyan-400"
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
        >
          <option value="">🎯 مستوى الصعوبة</option>
          {availableDifficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      {/* 🕹️ عرض الألعاب */}
      {filteredGames.length === 0 ? (
        <p className="mt-10 text-lg text-center text-gray-200">
          😅 لا توجد ألعاب تطابق الفلاتر المحددة.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="p-4 transition-all duration-300 shadow-lg cursor-pointer bg-white/10 backdrop-blur-md rounded-2xl hover:shadow-cyan-500/40 hover:scale-105"
            >
              <div className="relative w-full h-40 mb-3">
                <Image
                  src={game.image}
                  alt={game.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="mb-1 text-lg font-bold text-cyan-300">{game.name}</h3>
              <p className="text-sm text-gray-200">
                🎯 {game.category} | 👥 {game.players} | 🔥 {game.difficulty}
              </p>
              <p className="mt-1 text-xs text-gray-400">👶 {game.age}</p>
              <button className="w-full py-2 mt-3 font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400">
                <Link href={`/game/${game.id}`}>🎮 العب الآن</Link>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}