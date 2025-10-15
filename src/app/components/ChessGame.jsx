import { useEffect, useRef, useState } from "react";
import { Chess } from "chess.js";

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

