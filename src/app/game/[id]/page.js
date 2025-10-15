"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Chess } from "chess.js";
const allGames = [
  {
    id: 1,
    name: "لعبة الذاكرة السريعة",
    image: "https://images.pexels.com/photos/269851/pexels-photo-269851.jpeg",
    description: "اختبر ذاكرتك عبر تذكر أماكن الصور المتشابهة بأسرع وقت!",
    type: "memory",
  },
  {
    id: 2,
    name: "تحدي الذكاء المنطقي",
    image: "https://images.pexels.com/photos/432722/pexels-photo-432722.jpeg",
    description: "ألغاز منطقية تحتاج إلى تفكير عميق وتحليل ذكي للفوز.",
    type: "logic",
  },
  {
    id: 3,
    name: "سباق التفكير السريع",
    image: "https://images.pexels.com/photos/270807/pexels-photo-270807.jpeg",
    description: "احسب واستجب بسرعة قبل انتهاء الوقت! لعبة السرعة الذهنية.",
    type: "speed",
  },
  {
    id: 4,
    name: "الشطرنج الكلاسيكي",
    image: "https://images.pexels.com/photos/276024/pexels-photo-276024.jpeg",
    description: "لعبة الشطرنج الكلاسيكية الممتعة. حرّك القطع بحكمة!",
    type: "chess",
  },
  {
    id: 5,
    name: "تحدي الألوان السريعة",
    image: "https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg",
    description: "اختبر سرعة ملاحظتك واختيارك للألوان الصحيحة قبل انتهاء الوقت!",
    type: "colorChallenge",
  },

  // 🧠 الإضافة الجديدة رقم 1: مخصصة للمحترفين (Advanced Strategy)
  {
    id: 6,
    name: "سيد الاستراتيجية (Go)",
    image: "https://images.pexels.com/photos/592398/pexels-photo-592398.jpeg",
    description: "أصعب لعبة استراتيجية في العالم. تتطلب تخطيطاً بعيد المدى والسيطرة على المساحات. مخصصة للكبار.",
    type: "advanced_strategy", // <--- النوع الجديد
    tags: ["hard", "adults"],
  },

  // 🤯 الإضافة الجديدة رقم 2: مخصصة لعمق التفكير (Deep Logic/Puzzle)
  {
    id: 7,
    name: "متاهة المنطق المتعدد",
    image: "https://images.pexels.com/photos/355948/pexels-photo-355948.jpeg",
    description: "تحدي منطقي متعدد الطبقات يعتمد على حل مجموعة من الألغاز المتشابكة في وقت واحد. تحتاج تركيزاً مطلقاً.",
    type: "deep_logic_puzzle", // <--- النوع الجديد
    tags: ["hard", "complex"],
  },

  // 💣 الإضافة الجديدة رقم 3: لعبة سباق الأرقام المتفجرة
  {
    id: 8,
    name: "سباق الأرقام المتفجرة",
    image: "https://images.pexels.com/photos/4030088/pexels-photo-4030088.jpeg",
    description: "تخلص من مجموعات الأرقام المتشابهة في شبكة 5x5 قبل أن يصل عداد الانفجار إلى الصفر. حماسية وتتطلب السرعة ضد الذكاء الاصطناعي.",
    type: "blast_numerals", // <--- النوع الجديد
    tags: ["speed", "memory", "ai_opponent"],
  },
];
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

// 🎴 لعبة الذاكرة السريعة (MemoryGame) - الكود موجود بالفعل
function MemoryGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [won, setWon] = useState(false);
  const [restartTimer, setRestartTimer] = useState(0);

  const initializeGame = () => {
    const emojis = ["🍎", "🍌", "🍇", "🍉", "🍓", "🍒"];
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji }));
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setWon(false);
    setRestartTimer(0);
  };

  useEffect(() => {
    initializeGame();
  }, [won]);

  const flipCard = (index) => {
    if (won || flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched((prev) => [...prev, first, second]);
      }
      setTimeout(() => setFlipped([]), 800);
    }
  };

  useEffect(() => {
    if (cards.length > 0 && matched.length === cards.length) {
      setWon(true);
      let counter = 10;
      setRestartTimer(counter);
      const timer = setInterval(() => {
        counter--;
        setRestartTimer(counter);
        if (counter === 0) {
          clearInterval(timer);
          initializeGame();
        }
      }, 1000);
    }
  }, [matched]);

  return (
    <div className="relative mt-6 text-center">
      {won && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black bg-opacity-70 rounded-2xl">
          <h2 className="mb-4 text-3xl font-extrabold text-yellow-400 animate-bounce">
            🎉 مبروك! فزت باللعبة 🎉
          </h2>
          <p className="text-lg text-white">سيتم إعادة اللعبة بعد {restartTimer} ثانية...</p>
          <div className="mt-4 text-5xl animate-pulse">🎊🎈✨🥳</div>
        </div>
      )}

      <div className="grid max-w-sm grid-cols-4 gap-3 mx-auto">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => flipCard(index)}
            className={`flex items-center justify-center h-20 text-3xl font-bold rounded-lg cursor-pointer transition-all duration-300 ${
              flipped.includes(index) || matched.includes(index)
                ? "bg-cyan-500 text-white scale-105"
                : "bg-gray-700"
            }`}
          >
            {(flipped.includes(index) || matched.includes(index)) && card.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🧩 لعبة تحدي الذكاء المنطقي (LogicGame) - الكود موجود بالفعل
function LogicGame() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [restartTimer, setRestartTimer] = useState(0);

  const generateQuestion = () => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    let result;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
    }
    setQuestion(`${a} ${op} ${b} = ?`);
    setAnswer(result.toString());
    setInput("");
    setMessage("");
    setTimeLeft(20);
    setGameOver(false);
  };

  useEffect(() => {
    generateQuestion();
  }, [question]);

  // ⏱️ العد التنازلي
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setMessage("⏰ انتهى الوقت! خسرت 😢");
      endGame(false);
    }
  }, [timeLeft, gameOver]);

  const checkAnswer = () => {
    if (input === answer) {
      setMessage("🎉 إجابة صحيحة! فزت! 🎉");
      endGame(true);
    } else {
      setMessage("❌ إجابة خاطئة! حاول مرة أخرى 😔");
    }
  };

  const endGame = (won) => {
    setGameOver(true);
    let counter = 10;
    setRestartTimer(counter);
    const timer = setInterval(() => {
      counter--;
      setRestartTimer(counter);
      if (counter === 0) {
        clearInterval(timer);
        generateQuestion();
      }
    }, 1000);
  };

  return (
    <div className="mt-10 text-center">
      {!gameOver ? (
        <>
          <h2 className="mb-4 text-2xl font-bold text-yellow-300">🧠 {question}</h2>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-32 p-2 text-lg text-black rounded-lg"
          />
          <button
            onClick={checkAnswer}
            className="px-4 py-2 ml-2 text-white rounded-lg bg-cyan-600 hover:bg-cyan-500"
          >
            تحقق ✅
          </button>
          <p className="mt-4 text-lg text-white">{message}</p>
          <p className="mt-2 text-sm text-gray-300">⏱️ الوقت المتبقي: {timeLeft} ثانية</p>
        </>
      ) : (
        <div className="mt-6 text-center">
          {message.includes("فزت") ? (
            <div>
              <h2 className="text-3xl font-extrabold text-yellow-400 animate-bounce">
                🎉 أحسنت! إجابة صحيحة 🎉
              </h2>
              <p className="mt-2 text-white">سيبدأ تحدٍ جديد بعد {restartTimer} ثانية...</p>
              <div className="mt-4 text-5xl animate-pulse">🎊🎈✨🥳</div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-red-400">😢 خسرت هذه الجولة</h2>
              <p className="mt-2 text-white">سيبدأ تحدٍ جديد بعد {restartTimer} ثانية...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SpeedGame() {
  const [number, setNumber] = useState(null);
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [restartTimer, setRestartTimer] = useState(0);

  const generateNumber = () => {
    const num = Math.floor(Math.random() * 100) + 1;
    setNumber(num);
    setMessage("");
    setTimeLeft(5);
    setGameOver(false);
  };

  useEffect(() => {
    generateNumber();
  }, []);

  // ⏱️ العد التنازلي لكل رقم
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      endGame(false);
    }
  }, [timeLeft, gameOver]);

  const checkAnswer = (type) => {
    const isEven = number % 2 === 0;
    if ((type === "even" && isEven) || (type === "odd" && !isEven)) {
      setMessage("🎉 إجابة صحيحة! فزت! 🎉");
      endGame(true);
    } else {
      setMessage("❌ إجابة خاطئة! خسرت 😢");
      endGame(false);
    }
  };

  const endGame = (won) => {
    setGameOver(true);
    let counter = 10;
    setRestartTimer(counter);
    const timer = setInterval(() => {
      counter--;
      setRestartTimer(counter);
      if (counter === 0) {
        clearInterval(timer);
        generateNumber();
      }
    }, 1000);
  };

  return (
    <div className="mt-10 text-center">
      {!gameOver ? (
        <>
          <h2 className="mb-6 text-5xl font-extrabold text-yellow-300">{number}</h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => checkAnswer("even")}
              className="px-6 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
            >
              زوجي
            </button>
            <button
              onClick={() => checkAnswer("odd")}
              className="px-6 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
            >
              فردي
            </button>
          </div>
          <p className="mt-4 text-lg text-white">{message}</p>
          <p className="mt-2 text-sm text-gray-300">⏱️ الوقت المتبقي: {timeLeft} ثانية</p>
        </>
      ) : (
        <div className="mt-6 text-center">
          {message.includes("فزت") ? (
            <div>
              <h2 className="text-3xl font-extrabold text-yellow-400 animate-bounce">
                🎉 أحسنت! إجابة صحيحة 🎉
              </h2>
              <p className="mt-2 text-white">سيبدأ رقم جديد بعد {restartTimer} ثانية...</p>
              <div className="mt-4 text-5xl animate-pulse">🎊🎈✨🥳</div>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-red-400">😢 خسرت هذه الجولة</h2>
              <p className="mt-2 text-white">سيبدأ رقم جديد بعد {restartTimer} ثانية...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export function ChessGame() {
  const chess = useRef(new Chess());
  const stockfish = useRef(null);

  const [board, setBoard] = useState([]);
  const [turn, setTurn] = useState("white");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("اختر قطعة لتحريكها");
  const [isEngineReady, setIsEngineReady] = useState(false);

  // 🧩 تحويل القطع إلى رموز
  const pieceToUnicode = (piece) => {
    const map = {
      p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
      P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
    };
    return piece.color === "w" ? map[piece.type.toUpperCase()] : map[piece.type];
  };

  const pieceColor = (p) => "♙♖♘♗♕♔".includes(p) ? "white" : "black";
  const indexToSquare = (r, c) => String.fromCharCode(97 + c) + (8 - r);

  // 🧠 تحديث اللوحة
  const updateBoard = () => {
    setBoard(
      chess.current.board().map(row =>
        row.map(cell => (cell ? pieceToUnicode(cell) : null))
      )
    );

    if (chess.current.isGameOver()) {
      let result = "🏁 انتهت اللعبة! ";
      if (chess.current.isCheckmate()) result += "كش مات!";
      else if (chess.current.isDraw()) result += "تعادل 🤝";
      setMessage(result);

      if (stockfish.current) stockfish.current.terminate();
      setIsEngineReady(false);
    }
  };

  // 🚀 تشغيل المحرك عند تحميل اللعبة
  useEffect(() => {
    updateBoard();

    if (typeof window !== "undefined" && window.Worker) {
      stockfish.current = new Worker("/stockfishWorker.js");

      stockfish.current.onmessage = (event) => {
        const msg = event.data.trim();

        if (msg === "uciok") return;
        if (msg === "readyok") {
          setIsEngineReady(true);
          setMessage("♟️ المحرك جاهز! ابدأ باللون الأبيض.");
          return;
        }

        if (msg.startsWith("bestmove")) {
          const moveStr = msg.split(" ")[1];
          if (moveStr) {
            const move = chess.current.move({
              from: moveStr.slice(0, 2),
              to: moveStr.slice(2, 4),
              promotion: "q",
            });
            if (move) {
              updateBoard();
              setTurn("white");
              setMessage("🎯 دورك الآن!");
            }
          }
        }
      };

      stockfish.current.postMessage("uci");
      stockfish.current.postMessage("isready");
    }

    return () => {
      if (stockfish.current) stockfish.current.terminate();
    };
  }, []);

  // ♟️ التعامل مع النقر على الخلايا
  const handleClick = (row, col) => {
    const piece = board[row][col];
    if (turn === "black") {
      setMessage("🤖 انتظر، الكمبيوتر يفكر...");
      return;
    }

    if (!selected) {
      if (piece && pieceColor(piece) === turn) {
        setSelected({ row, col });
        setMessage(`القطعة ${piece} مختارة`);
      } else {
        setMessage("اختر قطعة تابعة لدورك ♙");
      }
      return;
    }

    // إلغاء أو تغيير الاختيار
    if (selected.row === row && selected.col === col) {
      setSelected(null);
      setMessage("تم إلغاء الاختيار.");
      return;
    }
    if (piece && pieceColor(piece) === turn) {
      setSelected({ row, col });
      setMessage(`تم اختيار القطعة ${piece}`);
      return;
    }

    // محاولة التحريك
    const from = indexToSquare(selected.row, selected.col);
    const to = indexToSquare(row, col);
    const move = chess.current.move({ from, to, promotion: "q" });

    if (move) {
      updateBoard();
      setSelected(null);
      setTurn("black");
      setMessage("🤖 الكمبيوتر يحرك...");

      if (isEngineReady && stockfish.current) {
        // يمكنك رفع مستوى الذكاء بتعديل depth أو movetime
     stockfish.current.postMessage(`position fen ${chess.current.fen()}`);
stockfish.current.postMessage("go movetime 1500"); // يفكر 1.5 ثانية ثم يختار أفضل حركة

      }
    } else {
      setSelected(null);
      setMessage("❌ حركة غير صالحة!");
    }
  };

  return (
    <div className="p-4 sm:p-6 text-center bg-gray-900 min-h-screen">
      <h2 className="mb-4 text-3xl sm:text-4xl font-bold text-yellow-300">
        ♟️ الشطرنج الكلاسيكي ♟️
      </h2>

      <p className={`text-base mb-4 ${isEngineReady ? "text-green-500" : "text-red-500"}`}>
        {isEngineReady
          ? "✅ المحرك: جاهز. ابدأ باللون الأبيض."
          : "⏳ جاري تحميل محرك Stockfish..."}
      </p>

      {/* اللوحة */}
      <div className="inline-block border-4 border-gray-700 shadow-xl max-w-full overflow-hidden rounded-xl">
        {board.map((row, rIdx) => (
          <div className="flex" key={rIdx}>
            {row.map((cell, cIdx) => {
              const isBlackCell = (rIdx + cIdx) % 2 === 1;
              const isSelected = selected?.row === rIdx && selected?.col === cIdx;
              let bgColor = isBlackCell ? "bg-gray-700" : "bg-yellow-100";
              if (isSelected) bgColor = isBlackCell ? "bg-gray-500" : "bg-yellow-300";

              return (
                <div
                  key={cIdx}
                  onClick={() => handleClick(rIdx, cIdx)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 
                              flex items-center justify-center text-3xl sm:text-4xl md:text-5xl 
                              cursor-pointer select-none ${bgColor} transition-all duration-100`}
                >
                  <span
                    className={cell ? (pieceColor(cell) === "white" ? "text-blue-500" : "text-red-500") : ""}
                  >
                    {cell}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 text-lg font-semibold text-white">{message}</p>
    </div>
  );
}
function ColorChallengeGameHard() {
  const colors = [
    { name: "أحمر", hex: "#ef4444" },
    { name: "وردي", hex: "#f472b6" },
    { name: "أزرق", hex: "#3b82f6" },
    { name: "أخضر", hex: "#10b981" },
    { name: "أصفر", hex: "#facc15" },
    { name: "برتقالي", hex: "#fb923c" },
    { name: "بنفسجي", hex: "#8b5cf6" },
    { name: "تركوازي", hex: "#14b8a6" },
  ];

  const [currentColor, setCurrentColor] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [effect, setEffect] = useState(""); // "correct" أو "wrong"

  const generateColor = () => {
    const color = colors[Math.floor(Math.random() * colors.length)];
    setCurrentColor(color);
    setTimeLeft(speed);
  };

  useEffect(() => {
    generateColor();
  }, []);

  useEffect(() => {
    if (!gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setEffect("wrong");
      setGameOver(true);
    }
  }, [timeLeft, gameOver]);

  const handleClick = (colorName) => {
    if (gameOver) return;

    if (colorName === currentColor.name) {
      setEffect("correct");
      setScore((prev) => prev + 1);
      setSpeed((prev) => Math.max(1, prev - 0.2)); // كل مرة أسرع قليلاً
      setTimeout(() => {
        setEffect("");
        generateColor();
      }, 300);
    } else {
      setEffect("wrong");
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setGameOver(false);
    setSpeed(5);
    setEffect("");
    generateColor();
  };

  return (
    <div className="mt-6 text-center">
      <h2 className="mb-4 text-3xl font-bold text-yellow-300 animate-pulse">🎨 تحدي الألوان الصعب</h2>

      {!gameOver ? (
        <>
          <div
            className={`w-40 h-40 mx-auto rounded-xl mb-4 shadow-lg transform transition-transform duration-300 ${
              effect === "correct" ? "scale-110 ring-4 ring-green-400" : ""
            } ${effect === "wrong" ? "scale-90 ring-4 ring-red-500" : ""}`}
            style={{ backgroundColor: currentColor?.hex }}
          ></div>
          <p className="mb-4 text-xl text-white">اختر اللون الصحيح: {currentColor?.name}</p>
          <div className="flex flex-wrap justify-center gap-4">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => handleClick(c.name)}
                className={`w-24 h-12 rounded-lg text-white font-bold shadow-lg transform transition-transform duration-200 
                hover:scale-105 ${
                  effect === "wrong" && c.name === currentColor?.name ? "ring-4 ring-red-500" : ""
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <p className="mt-4 text-lg text-white">النتيجة: {score}</p>
          <p className="mt-2 text-sm text-gray-300">
            ⏱️ الوقت المتبقي: {timeLeft.toFixed(1)} ثانية
          </p>
        </>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-extrabold text-red-400 animate-bounce">😢 انتهت اللعبة</h2>
          <p className="mt-2 text-xl text-white">النتيجة النهائية: {score}</p>
          <button
            onClick={restartGame}
            className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
          >
            🔄 إعادة اللعبة
          </button>
        </div>
      )}
    </div>
  );
}

export function GoGame() {
    const SIZE = 5;
    const initialBoard = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null));
    
    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState("black");
    const [message, setMessage] = useState("دور الأسود ⚫. ضع حجراً.");
    const [gameOver, setGameOver] = useState(false);
    const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 }); 
    
    // ... (هنا جميع الدوال المساعدة ومنطق اللعبة) ...
    
    // دالة مساعدة للحصول على الإحداثيات المجاورة
    const getNeighborsCoords = (r, c) => {
        const coords = [];
        if (r > 0) coords.push({ r: r - 1, c });
        if (r < SIZE - 1) coords.push({ r: r + 1, c });
        if (c > 0) coords.push({ r, c: c - 1 });
        if (c < SIZE - 1) coords.push({ r, c: c + 1 });
        return coords;
    };
    
    // دالة أساسية: تحقق من الحرية لمجموعة من الأحجار
    const getLiberties = (currentBoard, r, c, color) => {
        const stack = [{ r, c }];
        const groupStones = new Set();
        const libertiesSet = new Set();
        const key = (row, col) => `${row},${col}`;
    
        while (stack.length > 0) {
            const { r: currR, c: currC } = stack.pop();
            const currKey = key(currR, currC);
    
            if (groupStones.has(currKey)) continue;
            groupStones.add(currKey);
    
            for (const { r: nextR, c: nextC } of getNeighborsCoords(currR, currC)) {
                const nextCell = currentBoard[nextR][nextC];
                
                if (nextCell === null) {
                    libertiesSet.add(key(nextR, nextC));
                } else if (nextCell === color) {
                    stack.push({ r: nextR, c: nextC });
                }
            }
        }
        return libertiesSet.size; 
    };
    
    // دالة القبض الفعلية (إزالة الأحجار)
    const captureStones = (currentBoard, opponentColor) => {
        let capturedCount = 0;
        const newBoard = currentBoard.map(row => [...row]);
        const checkedGroups = new Set();
        const key = (r, c) => `${r},${c}`;
    
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (newBoard[r][c] === opponentColor && !checkedGroups.has(key(r, c))) {
                    
                    const liberties = getLiberties(newBoard, r, c, opponentColor);
                    
                    if (liberties === 0) {
                        const groupToCapture = [];
                        const stack = [{ r, c }];
                        const groupVisited = new Set([key(r, c)]);
                        groupToCapture.push({r, c});
                        
                        while(stack.length > 0) {
                            const {r: currR, c: currC} = stack.pop();
                            
                            for (const { r: nextR, c: nextC } of getNeighborsCoords(currR, currC)) {
                                const nextKey = key(nextR, nextC);
                                if (newBoard[nextR][nextC] === opponentColor && !groupVisited.has(nextKey)) {
                                    groupVisited.add(nextKey);
                                    checkedGroups.add(nextKey);
                                    groupToCapture.push({r: nextR, c: nextC});
                                    stack.push({r: nextR, c: nextC});
                                }
                            }
                        }
                        
                        groupToCapture.forEach(({r, c}) => newBoard[r][c] = null);
                        capturedCount += groupToCapture.length;
                    }
                    checkedGroups.add(key(r, c));
                }
            }
        }
        
        return { newBoard, capturedCount };
    };

    // منطق الخصم الآلي (AI) - (لا يحتاج لتعديل)
    const handleAiMove = (currentBoard) => {
        const emptyPoints = [];
        for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
            if (currentBoard[r][c] === null) {
              emptyPoints.push({ r, c });
            }
          }
        }
        if (emptyPoints.length === 0) return null;
        
        const aiColor = 'white';
        const opponentColor = 'black';
        const possibleMoves = [];
    
        for (const { r, c } of emptyPoints) {
            const tempBoard = currentBoard.map(row => [...row]);
            tempBoard[r][c] = aiColor;
            let score = 0;
            
            // 1. القبض المباشر (أعلى أولوية)
            const { capturedCount } = captureStones(tempBoard, opponentColor);
            if (capturedCount > 0) return { r, c };
            
            // 2. تجنب الانتحار (قاعدة أساسية)
            const libertiesAfterMove = getLiberties(tempBoard, r, c, aiColor);
            if (libertiesAfterMove === 0) continue; 
            
            // 3. تهديد القبض (حرية واحدة للخصم)
            let threatScore = 0;
            for (const { r: nR, c: nC } of getNeighborsCoords(r, c)) {
                if (currentBoard[nR]?.[nC] === opponentColor) {
                    const libertiesAfter = getLiberties(tempBoard, nR, nC, opponentColor);
                    if (libertiesAfter === 1) threatScore += 2;
                }
            }
            
            // 4. الدفاع (إنقاذ مجموعة بيضاء بخطر)
            let defenseScore = 0;
            for (const { r: nR, c: nC } of getNeighborsCoords(r, c)) {
                if (currentBoard[nR]?.[nC] === aiColor) {
                    const libertiesBefore = getLiberties(currentBoard, nR, nC, aiColor);
                    if (libertiesBefore === 1) defenseScore += 3;
                }
            }
            
            // 5. التجميع/التوسيع (إضافة حريات)
            const neighborCount = getNeighborsCoords(r, c).filter(({r: nr, c: nc}) => currentBoard[nr][nc] === aiColor).length;
            
            score = (defenseScore * 10) + (threatScore * 5) + (neighborCount * 1) + (libertiesAfterMove * 0.1);
    
            possibleMoves.push({ r, c, score });
        }
    
        if (possibleMoves.length === 0) return null; 
    
        possibleMoves.sort((a, b) => b.score - a.score);
    
        if (possibleMoves[0].score < 3) {
            const centerPoints = [{r: 2, c: 2}, {r: 1, c: 1}, {r: 3, c: 3}, {r: 1, c: 3}, {r: 3, c: 1}];
            for (const point of centerPoints) {
                if (currentBoard[point.r]?.[point.c] === null) {
                    return point;
                }
            }
        }
        
        return { r: possibleMoves[0].r, c: possibleMoves[0].c };
    };

    // 🔄 معالجة حركة اللاعب (لا تحتاج لتعديل)
    const placeStone = (r, c) => {
        if (gameOver || board[r][c] !== null || turn !== 'black') return;
    
        let newBoard = board.map(row => [...row]);
        newBoard[r][c] = turn;
        
        const opponentColor = 'white';
        const { newBoard: boardAfterWhiteCapture, capturedCount: whiteCaptured } = captureStones(newBoard, opponentColor);
    
        if (whiteCaptured === 0) {
            const playerLiberties = getLiberties(boardAfterWhiteCapture, r, c, turn);
            if (playerLiberties === 0) {
                setMessage("🔴 غير مسموح: هذه الحركة انتحارية (ليس للمجموعة حريات).");
                return; 
            }
        }
        
        if (whiteCaptured > 0) {
            setCapturedStones(prev => ({ 
                ...prev, 
                black: prev.black + whiteCaptured 
            }));
        }
        
        const nextTurn = 'white';
        updateGame(boardAfterWhiteCapture, nextTurn);
    };

    // 💡 دالة مركزية لتحديث حالة اللعبة والتحقق من الفوز (لا تحتاج لتعديل)
    const updateGame = (currentBoard, nextTurn) => {
        let movesCount = 0;
        currentBoard.forEach(row => {
            row.forEach(cell => {
                if (cell !== null) movesCount++;
            });
        });
        
        setBoard(currentBoard);
        setTurn(nextTurn);
        setMessage(`دور ${nextTurn === 'black' ? 'الأسود ⚫' : 'الأبيض ⚪ (AI)'}.`);

        if (movesCount === SIZE * SIZE) {
            setGameOver(true);
            setCapturedStones(finalScores => {
                const finalBlackScore = finalScores.black;
                const finalWhiteScore = finalScores.white;
                
                if (finalBlackScore > finalWhiteScore) {
                    setMessage(`انتهت اللعبة! 🏆 فاز الأسود بـ ${finalBlackScore} حجرًا مأسورًا. (الأبيض: ${finalWhiteScore})`);
                } else if (finalWhiteScore > finalBlackScore) {
                    setMessage(`انتهت اللعبة! 🏆 فاز الأبيض (AI) بـ ${finalWhiteScore} حجرًا مأسورًا. (الأسود: ${finalBlackScore})`);
                } else {
                    setMessage("انتهت اللعبة بالتعادل!");
                }
                return finalScores;
            });
        }
    };

    // 🤖 useEffect للذكاء الاصطناعي (لا تحتاج لتعديل)
    useEffect(() => {
        if (turn === 'white' && !gameOver) {
            setMessage("الذكاء الاصطناعي يفكر... 🤖");
            const timer = setTimeout(() => {
                const aiMove = handleAiMove(board);
                
                if (aiMove) {
                    let newBoard = board.map(row => [...row]);
                    newBoard[aiMove.r][aiMove.c] = 'white';
                    
                    const opponentColor = 'black';
                    const { newBoard: boardAfterBlackCapture, capturedCount: blackCaptured } = captureStones(newBoard, opponentColor);

                    if (blackCaptured === 0) {
                        const aiLiberties = getLiberties(boardAfterBlackCapture, aiMove.r, aiMove.c, 'white');
                        if (aiLiberties === 0) {
                            console.warn("AI attempted a suicidal move and was ignored.");
                            updateGame(board, 'black'); 
                            return;
                        }
                    }
                    
                    if (blackCaptured > 0) {
                        setCapturedStones(prev => ({ 
                            ...prev, 
                            white: prev.white + blackCaptured 
                        }));
                    }
                    
                    updateGame(boardAfterBlackCapture, 'black');
                } else {
                    setGameOver(true);
                    setMessage("انتهت اللعبة لعدم وجود حركات!");
                }
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [turn, gameOver, board]); 

    // دالة إعادة التشغيل (لا تحتاج لتعديل)
    const restartGame = () => {
        setBoard(initialBoard.map(row => [...row]));
        setTurn("black");
        setMessage("دور الأسود ⚫. ضع حجراً.");
        setGameOver(false);
        setCapturedStones({ black: 0, white: 0 });
    }

    // 📱 الجزء الخاص بالعرض المُعدَّل للتوافق مع شاشات الجوال
    return (
        <div className="flex justify-center min-h-screen p-4 sm:p-6 bg-gray-900">
            <div className="w-full max-w-5xl">
                <h2 className="mb-4 text-3xl sm:text-4xl font-extrabold text-center text-yellow-400">سيد الاستراتيجية: Go</h2>
                <p className="mb-8 text-sm sm:text-lg text-center text-gray-400">شبكة 5x5  القبض هو مفتاح الفوز!</p>
                
                {/* 🌟 التعديل 1: تحويل التخطيط إلى عمودي على الجوال وأفقي على الأجهزة المتوسطة */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                    
                    {/* 🎲 جزء اللعبة والنتائج - (يأخذ الشاشة بالكامل على الجوال) */}
                    <div className="flex flex-col items-center w-full md:w-2/3">
                        <div className="w-full p-3 sm:p-4 mb-6 bg-gray-800 rounded-lg shadow-xl">
                            {/* 🌟 التعديل 2: تقليل حجم الخط لإحصائيات النقاط على الجوال */}
                            <div className="flex justify-around text-base sm:text-xl font-bold">
                                <div className="text-red-400">
                                    ⚫ الأسود (مأسور): <span className="text-2xl sm:text-3xl">{capturedStones.black}</span>
                                </div>
                                <div className="text-white">
                                    ⚪ الأبيض (AI مأسور): <span className="text-2xl sm:text-3xl">{capturedStones.white}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* لوحة اللعب */}
                        <div className="inline-block p-2 sm:p-4 bg-yellow-900 border-4 sm:border-8 border-gray-700 rounded-lg shadow-2xl overflow-x-auto">
                            {board.map((row, rIdx) => (
                                <div className="flex" key={rIdx}>
                                    {row.map((cell, cIdx) => (
                                        <div
                                            key={cIdx}
                                            onClick={() => placeStone(rIdx, cIdx)} 
                                            // 🌟 التعديل 3: تقليل حجم الخلية على الشاشات الصغيرة
                                            className={`relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center cursor-pointer 
                                                        transition-all duration-100 border border-gray-600 bg-yellow-800
                                                        ${(turn === 'black' && cell === null && !gameOver) ? 'hover:bg-yellow-700' : ''}`}
                                        >
                                            
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-full h-px bg-gray-500"></div>
                                                <div className="absolute w-px h-full bg-gray-500"></div>
                                            </div>

                                            {/* الحجر (تصغير حجم الحجر أيضاً) */}
                                            {cell && (
                                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full shadow-lg ${cell === 'black' ? 'bg-gray-900' : 'bg-white'}`}></div>
                                            )}
                                            
                                            {/* مؤشر الدور للمستخدم */}
                                            {!gameOver && turn === 'black' && cell === null && (
                                                <div className="absolute w-8 h-8 sm:w-12 sm:h-12 rounded-full opacity-30 hover:opacity-100"
                                                        style={{ backgroundColor: '#374151' }}
                                                ></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        
                        <p className={`mt-6 text-lg sm:text-2xl font-semibold ${gameOver ? 'text-green-400' : 'text-white'}`}>{message}</p>
                        
                        <button
                            onClick={restartGame}
                            className="px-6 sm:px-8 py-2 sm:py-3 mt-4 text-lg sm:text-xl font-semibold text-white transition-transform transform bg-red-600 rounded-xl hover:bg-red-500 hover:scale-105"
                        >
                            🔄 ابدأ جولة جديدة
                        </button>
                    </div>
                    
                    {/* 📜 جزء القوانين المُنظَّم - (يأخذ الشاشة بالكامل على الجوال) */}
                    <div className="w-full md:w-1/3 p-4 sm:p-6 text-right text-white bg-gray-800 rounded-lg shadow-2xl h-fit">
                        <h3 className="pb-2 mb-4 text-xl sm:text-2xl font-bold border-b-2 border-cyan-500 text-cyan-400">قوانين اللعبة (المبسطة)</h3>
                        <ul className="space-y-4 text-gray-300 list-decimal list-inside">
                            {/* تم تعديل حجم الخط للعناوين والنصوص الداخلية لتناسب الشاشات الصغيرة */}
                            <li>
                                <span className="text-base sm:text-lg font-bold text-white">الهدف (The Goal)</span>
                                <p className="mt-1 mr-4 text-xs sm:text-sm">الفوز بأكبر عدد من أحجار الخصم المأسورة. نقاطك هي عدد الأحجار التي قبضت عليها.</p>
                            </li>
                            <li>
                                <span className="text-base sm:text-lg font-bold text-white">الحريات (Liberties)</span>
                                <p className="mt-1 mr-4 text-xs sm:text-sm">الحجر أو المجموعة يجب أن تكون لها **مساحة فارغة واحدة على الأقل (حرية) مجاورة لها.</p>
                            </li>
                            <li>
                                <span className="text-base sm:text-lg font-bold text-white">القبض (Capture)</span>
                                <p className="mt-1 mr-4 text-xs sm:text-sm">إذا تم تطويق مجموعة من أحجار الخصم بالكامل، فإنها تفقد حرياتها وتُزال من اللوحة وتُحسب كنقاط لك.</p>
                            </li>
                            <li>
                                <span className="text-base sm:text-lg font-bold text-red-300">قاعدة الانتحار (No Suicide)</span>
                                <p className="mt-1 mr-4 text-xs sm:text-sm">لا يسمح بوضع حجر في نقطة يؤدي فيها إلى فقدان كل حريات مجموعتك الجديدة، إلا إذا كانت هذه الحركة تؤدي إلى القبض على حجر خصم في نفس الوقت.</p>
                            </li>
                            <li>
                                <span className="text-base sm:text-lg font-bold text-white">نهاية اللعبة</span>
                                <p className="mt-1 mr-4 text-xs sm:text-sm">اللعبة تنتهي عند امتلاء اللوحة. الفائز هو من يملك أعلى نقاط قبض.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DeepLogicPuzzle() {
    const [equations, setEquations] = useState({});
    const [solution, setSolution] = useState({});
    const [inputX, setInputX] = useState('');
    const [inputY, setInputY] = useState('');
    const [message, setMessage] = useState("");
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const generateEquations = () => {
        // x + y = sum
        // a*x - b*y = diff
        let x, y, a, b;
        
        // ضمان أن تكون الأرقام صحيحة وصغيرة
        do {
            x = Math.floor(Math.random() * 5) + 2; // 2-6
            y = Math.floor(Math.random() * 5) + 2; // 2-6
            a = Math.floor(Math.random() * 2) + 1; // 1-2
            b = Math.floor(Math.random() * 2) + 1; // 1-2
        } while (a * x - b * y <= 0); // نضمن نتيجة إيجابية للمعادلة الثانية

        const sum = x + y;
        const diff = a * x - b * y;

        setEquations({
            eq1: `x + y = ${sum}`,
            eq2: `${a !== 1 ? a : ''}x - ${b !== 1 ? b : ''}y = ${diff}`
        });
        setSolution({ x, y });
        
        setInputX('');
        setInputY('');
        setMessage("أوجد قيمة x و y قبل انتهاء الوقت!");
        setTimeLeft(15);
        setGameOver(false);
    };

    useEffect(() => {
        generateEquations();
    }, []);

    // ⏱️ العد التنازلي
    useEffect(() => {
        if (timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !gameOver) {
            setMessage(`⏰ انتهى الوقت! خسرت. الحل كان: x=${solution.x}, y=${solution.y}`);
            setGameOver(true);
        }
    }, [timeLeft, gameOver, solution]);

    const checkAnswer = () => {
        if (gameOver) return;
        
        const currentX = parseInt(inputX);
        const currentY = parseInt(inputY);

        if (currentX === solution.x && currentY === solution.y) {
            setMessage("🎉 إجابة صحيحة! فزت بهذه الجولة! 🎉");
            setScore(prev => prev + 1);
            setGameOver(true);
            setTimeout(generateEquations, 3000); // تحدي جديد
        } else {
            setMessage("❌ إجابة خاطئة! حاول مرة أخرى.");
        }
    };

    const restartGame = () => {
        setScore(0);
        generateEquations();
    };

    return (
        <div className="mt-10 text-center">
            <h2 className="mb-6 text-3xl font-bold text-yellow-300">🤯 متاهة المنطق المتعدد</h2>

            <p className="mb-4 text-xl font-bold text-white">
                النتيجة: <span className="text-cyan-400">{score}</span>
            </p>

            {!gameOver ? (
                <>
                    <div className="flex flex-col items-center max-w-sm p-6 mx-auto mb-6 bg-gray-800 shadow-xl rounded-xl">
                        <p className="mb-2 font-mono text-2xl text-green-400">{equations.eq1}</p>
                        <p className="font-mono text-2xl text-red-400">{equations.eq2}</p>
                    </div>

                    <div className="flex justify-center gap-4 mb-4">
                        <div className="text-left">
                            <label className="text-white">x:</label>
                            <input
                                type="number"
                                value={inputX}
                                onChange={(e) => setInputX(e.target.value)}
                                className="w-20 p-2 ml-2 text-lg text-black rounded-lg"
                                disabled={gameOver}
                            />
                        </div>
                        <div className="text-left">
                            <label className="text-white">y:</label>
                            <input
                                type="number"
                                value={inputY}
                                onChange={(e) => setInputY(e.target.value)}
                                className="w-20 p-2 ml-2 text-lg text-black rounded-lg"
                                disabled={gameOver}
                            />
                        </div>
                    </div>
                    
                    <button
                        onClick={checkAnswer}
                        className="px-6 py-3 mt-2 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
                        disabled={gameOver || !inputX || !inputY}
                    >
                        تحقق ✅
                    </button>
                    <p className="mt-4 text-lg text-white">{message}</p>
                    <p className="mt-2 text-sm text-gray-300">⏱️ الوقت المتبقي: {timeLeft} ثانية</p>
                </>
            ) : (
                <div className="mt-6 text-center">
                    <h2 className="text-3xl font-extrabold text-red-400 animate-bounce">😢 انتهت الجولة</h2>
                    <p className="mt-2 text-xl text-white">النتيجة الحالية: {score}</p>
                    <p className="mt-2 text-lg text-gray-300">الحل: x={solution.x}, y={solution.y}</p>
                    <button
                        onClick={restartGame}
                        className="px-6 py-3 mt-4 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
                    >
                        🔄 ابدأ جولة جديدة
                    </button>
                </div>
            )}
        </div>
    );
}


// 🧠 صفحة اللعبة الرئيسية
export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [started, setStarted] = useState(false);

  const game = allGames.find((g) => g.id === Number(id));

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gray-900">
        <h2 className="mb-4 text-2xl">😕 اللعبة غير موجودة</h2>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 mt-2 text-white rounded-lg bg-cyan-600 hover:bg-cyan-500"
        >
          🔙 عودة للصفحة الرئيسية
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="mb-4 text-3xl font-extrabold">{game.name}</h1>

        {!started ? (
          <>
            <div className="relative w-full h-64 mb-6 overflow-hidden rounded-2xl">
              <Image src={game.image} alt={game.name} fill className="object-cover" />
            </div>
            <p className="mb-6 text-lg text-gray-200">{game.description}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setStarted(true)}
                className="px-6 py-3 text-lg font-semibold text-white bg-cyan-600 rounded-xl hover:bg-cyan-500"
              >
                🎮 ابدأ اللعب الآن
              </button>
              <Link
                href="/"
                className="px-6 py-3 text-lg font-semibold text-white bg-gray-700 rounded-xl hover:bg-gray-600"
              >
                ⬅️ عودة
              </Link>
            </div>
          </>
        ) : (
          <>
            {game.type === "memory" && <MemoryGame />}
            {game.type === "logic" && <LogicGame />}
            {game.type === "speed" && <SpeedGame />}
            {game.type === "chess" && <ChessGame />}
            {game.type === "colorChallenge" && <ColorChallengeGameHard />}
            {game.type === "advanced_strategy" && <GoGame />} 
            {game.type === "deep_logic_puzzle" && <DeepLogicPuzzle />}
            {game.type === "blast_numerals" && <BlastNumeralsGame />}
            {game.type !== "memory" && game.type !== "logic" && game.type !== "speed" && 
             game.type !== "chess" && game.type !== "colorChallenge" && 
             game.type !== "advanced_strategy" && game.type !== "deep_logic_puzzle" && (
                <p className="mt-10 text-lg text-gray-200">🚧 اللعبة {game.name} قيد التطوير حالياً...</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}