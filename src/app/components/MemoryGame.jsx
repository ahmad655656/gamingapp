import { useEffect, useState } from "react";

// 🎴 لعبة الذاكرة السريعة (MemoryGame) - الكود موجود بالفعل
export default function MemoryGame() {
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
      let counter = 5;
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




