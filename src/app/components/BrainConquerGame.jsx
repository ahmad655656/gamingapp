import { useEffect, useState } from "react";

const PUZZLES = [
  {
    question: "أي الرقم يكمل التسلسل: 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "36"],
    answer: "32",
  },
  {
    question: "أي كلمة لا تنتمي للمجموعة: تفاحة، موز، طماطم، برتقال؟",
    options: ["تفاحة", "موز", "طماطم", "برتقال"],
    answer: "طماطم",
  },
  {
    question: "إذا كان جميع المربعات زرقاء وبعض المربعات كبيرة، هل جميع المربعات الكبيرة زرقاء؟",
    options: ["نعم", "لا", "غير معروف", "لا يمكن تحديد"],
    answer: "غير معروف",
  },
  {
    question: "كم زاوية يحتوي المثلث؟",
    options: ["2", "3", "4", "5"],
    answer: "3",
  },
];

export function BrainConquerGame() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(20); // عداد لكل سؤال
  const [gameOver, setGameOver] = useState(false);

  // ⏳ عداد الوقت لكل سؤال
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          handleNext(false);
          return 20;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, gameOver]);

  const handleNext = (correct = null) => {
    if (correct) setScore(score + 1);
    setSelected("");
    if (current + 1 < PUZZLES.length) {
      setCurrent(current + 1);
      setTime(20);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e] text-white p-8">
        <h1 className="text-5xl font-extrabold text-cyan-400 mb-6 drop-shadow-lg">
          🏆 انتهت اللعبة!
        </h1>
        <p className="text-2xl text-gray-300 mb-4">
          مجموع النقاط: <span className="text-yellow-400">{score}</span> من {PUZZLES.length}
        </p>
        <button
          onClick={() => { setCurrent(0); setScore(0); setGameOver(false); setTime(20); }}
          className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl shadow-lg transition-all"
        >
          🔄 إعادة اللعب
        </button>
      </div>
    );
  }

  const puzzle = PUZZLES[current];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#020617] via-[#04102a] to-[#030a1e] text-white p-8">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400 drop-shadow-lg">🧠 غزو العقول</h1>
      <p className="mb-6 text-lg text-gray-300">سارع بالإجابة قبل نفاد الوقت! ⏳</p>

      {/* السؤال */}
      <div className="bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">{puzzle.question}</h2>
        <div className="grid grid-cols-2 gap-4">
          {puzzle.options.map((opt) => (
            <button
              key={opt}
              onClick={() => { setSelected(opt); handleNext(opt === puzzle.answer); }}
              className={`p-4 rounded-xl font-bold text-lg transition-all hover:scale-105
                ${selected === opt ? "bg-green-500 text-black" : "bg-cyan-600/70 hover:bg-cyan-500"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* عداد الوقت */}
      <div className="text-3xl font-extrabold mb-4">
        ⏱️ {time} ثانية
      </div>

      <p className="text-gray-400">السؤال {current + 1} من {PUZZLES.length}</p>
    </div>
  );
}