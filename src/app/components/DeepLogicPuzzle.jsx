const { useState, useEffect } = require("react");

export default function DeepLogicPuzzle() {
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
