import { useCallback, useEffect, useRef, useState } from "react";

const GRID_SIZE = 5;
const MAX_NUMBER = 5; // الأرقام من 1 إلى 5
const INITIAL_BOMB_TIME = 15; // ثواني للانفجار
const MAX_HEALTH = 3;

// 🎨 لوحة الألوان
const COLORS = {
    1: 'bg-red-600', 2: 'bg-blue-600', 3: 'bg-green-600',
    4: 'bg-yellow-600', 5: 'bg-purple-600', empty: 'bg-gray-700'
};

// ==========================================================
// 🛠️ دوال مساعدة
// ==========================================================

// دالة لإنشاء شبكة عشوائية
const createInitialGrid = () => {
    return Array(GRID_SIZE).fill(null).map(() =>
        Array(GRID_SIZE).fill(null).map(() => Math.floor(Math.random() * MAX_NUMBER) + 1)
    );
};

// دالة للبحث عن مجموعة الأرقام المتشابهة المتجاورة (منطق DFS/BFS مبسط)
// هنا نبحث عن كل الأرقام المتشابهة في الشبكة (لتبسيط اللعبة الحماسية)
const findMatches = (grid, targetNumber) => {
    const matches = [];
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (grid[r][c] === targetNumber) {
                matches.push({ r, c });
            }
        }
    }
    return matches;
};


// ==========================================================
// 💣 المكون الرئيسي للعبة
// ==========================================================
export function BlastNumeralsGame() {
  const [grid, setGrid] = useState(createInitialGrid());
  const [turn, setTurn] = useState("player");
  const [message, setMessage] = useState("🎯 دورك! انقر على رقم لتفجير مجموعته.");
  const [gameOver, setGameOver] = useState(false);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [aiHealth, setAiHealth] = useState(MAX_HEALTH);
  const [bombTimer, setBombTimer] = useState(INITIAL_BOMB_TIME);
  const activeTimerRef = useRef(null);

  // 💣 مؤقت الانفجار
  useEffect(() => {
    if (gameOver) {
      clearInterval(activeTimerRef.current);
      return;
    }

    activeTimerRef.current = setInterval(() => {
      setBombTimer((prev) => {
        if (prev === 1) {
          setMessage(`💥 انفجار! ${turn === "player" ? "أنت" : "🤖 الذكاء الاصطناعي"} خسر نقطة صحة!`);

          if (turn === "player") {
            setHealth((h) => {
              if (h - 1 <= 0) {
                setGameOver(true);
                setMessage("🏆 انتهت اللعبة! الذكاء الاصطناعي فاز 💀");
                return 0;
              }
              setTurn("ai");
              return h - 1;
            });
          } else {
            setAiHealth((h) => {
              if (h - 1 <= 0) {
                setGameOver(true);
                setMessage("🔥 مبروك! أنت الفائز 🏆");
                return 0;
              }
              setTurn("player");
              return h - 1;
            });
          }

          setGrid(createInitialGrid());
          return INITIAL_BOMB_TIME;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(activeTimerRef.current);
  }, [turn, gameOver]);

  // 🎮 حركة اللاعب
  const handlePlayerMove = (r, c) => {
    if (turn !== "player" || gameOver) return;
    const targetNumber = grid[r][c];
    if (!targetNumber) return;

    const matches = findMatches(grid, targetNumber);
    if (matches.length < 2) {
      setMessage("❌ خطأ! اختر مجموعة أكبر من رقم واحد. 🤖 دور الذكاء الاصطناعي.");
      setTurn("ai");
      setBombTimer(INITIAL_BOMB_TIME);
      return;
    }

    let newGrid = grid.map((row) => [...row]);
    matches.forEach(({ r, c }) => (newGrid[r][c] = null));

    newGrid = newGrid.map((row) =>
      row.map((cell) => (cell === null ? Math.floor(Math.random() * MAX_NUMBER) + 1 : cell))
    );

    setGrid(newGrid);
    setMessage(`💣 أزلت ${matches.length} × ${targetNumber}! 🤖 دور الذكاء الاصطناعي.`);
    setTurn("ai");
    setBombTimer(INITIAL_BOMB_TIME);
  };

  // 🤖 حركة الذكاء الاصطناعي
  const handleAiMove = useCallback(() => {
    if (turn !== "ai" || gameOver) return;

    let bestTarget = null;
    let maxMatches = 0;
    for (let num = 1; num <= MAX_NUMBER; num++) {
      const matches = findMatches(grid, num);
      if (matches.length > maxMatches) {
        maxMatches = matches.length;
        bestTarget = num;
      }
    }

    if (maxMatches < 2) {
      setMessage("🤖 لم يجد الذكاء الاصطناعي مجموعة كبيرة! 🎯 دورك الآن!");
      setTurn("player");
      setBombTimer(INITIAL_BOMB_TIME);
      return;
    }

    const matches = findMatches(grid, bestTarget);
    let newGrid = grid.map((row) => [...row]);
    matches.forEach(({ r, c }) => (newGrid[r][c] = null));
    newGrid = newGrid.map((row) =>
      row.map((cell) => (cell === null ? Math.floor(Math.random() * MAX_NUMBER) + 1 : cell))
    );

    setGrid(newGrid);
    setMessage(`🤖 أزال ${matches.length} × ${bestTarget}! 🎯 دورك الآن!`);
    setTurn("player");
    setBombTimer(INITIAL_BOMB_TIME);
  }, [turn, gameOver, grid]);

  useEffect(() => {
    if (turn === "ai" && !gameOver) {
      setTimeout(handleAiMove, 1000);
    }
  }, [turn, gameOver, handleAiMove]);

  const restartGame = () => {
    setGrid(createInitialGrid());
    setTurn("player");
    setMessage("🎯 دورك! انقر على رقم لتفجير مجموعته.");
    setGameOver(false);
    setHealth(MAX_HEALTH);
    setAiHealth(MAX_HEALTH);
    setBombTimer(INITIAL_BOMB_TIME);
    clearInterval(activeTimerRef.current);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-cyan-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-400 to-cyan-400 drop-shadow-lg mb-8">
        💣 سباق الأرقام المتفجرة
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl">
        {/* 🎯 لوحة التحكم */}
        <div className="w-full lg:w-1/4 p-6 bg-gradient-to-br from-gray-800 to-gray-700 border border-cyan-700 rounded-2xl shadow-[0_0_25px_rgba(0,255,255,0.3)]">
          <h3 className="text-2xl text-cyan-400 font-bold mb-3 text-center">🧠 الحالة</h3>
          <p className="text-lg mb-2">👤 صحتك: <span className="text-green-400 font-bold">{health}</span> ❤️</p>
          <p className="text-lg mb-6">🤖 صحة الذكاء: <span className="text-green-400 font-bold">{aiHealth}</span> ❤️</p>

          <div className="text-center my-4">
            <p className="text-sm text-gray-400">⏳ عداد الانفجار:</p>
            <div className={`text-5xl font-extrabold mt-2 ${bombTimer <= 5 ? "text-red-500 animate-pulse" : "text-yellow-400"}`}>
              {bombTimer}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-300 bg-gray-800/60 p-3 rounded-lg border border-gray-600 text-center">
            {message}
          </p>

          <button
            onClick={restartGame}
            className="w-full mt-5 py-2 bg-red-700 hover:bg-red-600 transition-colors rounded-lg text-white font-semibold shadow-lg shadow-red-800/40"
          >
            🔄 إعادة التشغيل
          </button>
        </div>

        {/* 🔢 شبكة اللعبة */}
        <div className="flex-1 bg-gray-800/70 p-4 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-cyan-800 flex justify-center items-center">
          <div
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
            className="grid gap-2 w-full aspect-square max-w-lg"
          >
            {grid.flat().map((number, index) => {
              const r = Math.floor(index / GRID_SIZE);
              const c = index % GRID_SIZE;
              return (
                <button
                  key={index}
                  onClick={() => handlePlayerMove(r, c)}
                  disabled={turn !== "player" || gameOver}
                  className={`rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold transition-all duration-150 
                    ${COLORS[number] || COLORS.empty} 
                    ${turn === "player" && !gameOver ? "hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)]" : "opacity-60 cursor-default"}
                  `}
                >
                  {number || ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* 📘 شرح اللعبة */}
        <div className="w-full lg:w-1/4 bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl border border-cyan-700 shadow-[0_0_25px_rgba(0,255,255,0.3)]">
          <h3 className="text-2xl font-bold text-cyan-400 mb-4 text-center">📘 شرح اللعبة</h3>
          <ul className="space-y-3 text-gray-200 text-sm leading-relaxed">
            <li>🎯 الهدف: حذف المجموعات المتشابهة قبل الانفجار.</li>
            <li>🕹️ انقر على رقم لتفجيره مع مجموعته.</li>
            <li>💥 عند انتهاء الوقت تخسر نقطة صحة.</li>
            <li>🤖 الذكاء يحاول تفجير أكبر مجموعة ممكنة.</li>
            <li>🏆 من يبقى بصحة أكبر هو الفائز.</li>
          </ul>
          <p className="mt-5 text-center text-cyan-300 font-semibold">
            كن الأسرع قبل الانفجار! ⚡
          </p>
        </div>
      </div>
    </div>
  );
}
