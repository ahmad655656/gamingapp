const { useState, useEffect } = require("react");

export default function SpeedGame() {
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
    let counter = 5;
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