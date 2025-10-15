const { useState, useEffect, useCallback } = require("react");

// 🧩 لعبة تحدي الذكاء المنطقي (LogicGame) - الكود المصحح
export default function LogicGame() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [restartTimer, setRestartTimer] = useState(0);

  // 1. ⚙️ استخدام useCallback لمنع إعادة إنشاء الدالة في كل Re-render
  const generateQuestion = useCallback(() => {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = ["+", "-", "*"][Math.floor(Math.random() * 3)];
    let result;
    switch (op) {
      case "+": result = a + b; break;
      case "-": result = a - b; break;
      case "*": result = a * b; break;
      default: result = 0; // احتياطي
    }
    
    // تحديث الحالة
    setQuestion(`${a} ${op} ${b} = ?`);
    setAnswer(result.toString());
    setInput("");
    setMessage("");
    setTimeLeft(20);
    setGameOver(false);
  }, []); // لا توجد توابع، مما يعني أنها ثابتة

  // 2. 🛑 استخدام useCallback أيضاً لدالة إنهاء اللعبة
  const endGame = useCallback((won) => {
    setGameOver(true);
    let counter = 5;
    setRestartTimer(counter);
    
    const timer = setInterval(() => {
      counter--;
      setRestartTimer(counter);
      if (counter === 0) {
        clearInterval(timer);
        // استدعاء generateQuestion في النهاية
        generateQuestion(); 
      }
    }, 1000);

    // 3. 🧹 إضافة وظيفة تنظيف المؤقت لمنع تراكم المؤقتات
    return () => clearInterval(timer);
  }, [generateQuestion]);

  // 🚀 تشغيل دالة generateQuestion مرة واحدة فقط عند تحميل المكون
  // 🚨 تم تغيير [question] إلى [] لمنع الحلقة اللانهائية
  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]); // يجب إضافة generateQuestion كتابع لأنها useCallback

  // ⏱️ العد التنازلي
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setMessage("⏰ انتهى الوقت! خسرت 😢");
      endGame(false);
    }
  }, [timeLeft, gameOver, endGame]);

  const checkAnswer = () => {
    if (input === answer) {
      setMessage("🎉 إجابة صحيحة! فزت! 🎉");
      // يجب أن تعيد endGame دالة تنظيف، لكنها تستخدم في useEffect كدالة Side Effect
      endGame(true); 
    } else {
      setMessage("❌ إجابة خاطئة! حاول مرة أخرى 😔");
    }
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
            // 🖱️ إضافة ضغطة Enter للتحقق
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                checkAnswer();
              }
            }}
            autoFocus
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
          {message.includes("صحيحة") ? (
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