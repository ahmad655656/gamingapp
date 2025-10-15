const { useState, useEffect } = require("react");

export default function ColorChallengeGameHard() {
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