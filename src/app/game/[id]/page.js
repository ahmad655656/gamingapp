"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState} from "react";
import { GoGame } from "@/app/components/GoGame";
import DeepLogicPuzzle from "@/app/components/DeepLogicPuzzle";
import ColorChallengeGameHard from "@/app/components/ColorChallengeGameHard";
import { ChessGame } from "@/app/components/ChessGame";
import { BrainConquerGame } from "@/app/components/BrainConquerGame";
import SpeedGame from "@/app/components/SpeedGame";
import MemoryGame from "@/app/components/MemoryGame";
import LogicGame from "@/app/components/LogicGame";
import { BlastNumeralsGame } from "@/app/components/BlastNumeralsGame";
const allGames = [
  {
    id: 1,
    name: "لعبة الذاكرة السريعة",
    image: "/asset/11.webp",
    description: "اختبر ذاكرتك عبر تذكر أماكن الصور المتشابهة بأسرع وقت!",
    type: "memory",
  },
  {
    id: 2,
    name: "تحدي الذكاء المنطقي",
    image: "/asset/22.webp",
    description: "ألغاز منطقية تحتاج إلى تفكير عميق وتحليل ذكي للفوز.",
    type: "logic",
  },
  {
    id: 3,
    name: "سباق التفكير السريع",
    image: "/asset/33.webp",
    description: "احسب واستجب بسرعة قبل انتهاء الوقت! لعبة السرعة الذهنية.",
    type: "speed",
  },
  {
    id: 4,
    name: "الشطرنج الكلاسيكي",
    image: "/asset/44.webp",
    description: "لعبة الشطرنج الكلاسيكية الممتعة. حرّك القطع بحكمة!",
    type: "chess",
  },
  {
    id: 5,
    name: "تحدي الألوان السريعة",
    image: "/asset/55.webp",
    description:
      "اختبر سرعة ملاحظتك واختيارك للألوان الصحيحة قبل انتهاء الوقت!",
    type: "colorChallenge",
  }, // 🧠 الإضافة الجديدة رقم 1: مخصصة للمحترفين (Advanced Strategy)

  {
    id: 6,
    name: "سيد الاستراتيجية (Go)",
    image: "/asset/66.webp",
    description:
      "أصعب لعبة استراتيجية في العالم. تتطلب تخطيطاً بعيد المدى والسيطرة على المساحات. مخصصة للكبار.",
    type: "advanced_strategy", // <--- النوع الجديد
    tags: ["hard", "adults"],
  }, // 🤯 الإضافة الجديدة رقم 2: مخصصة لعمق التفكير (Deep Logic/Puzzle)

  {
    id: 7,
    name: "متاهة المنطق المتعدد",
    image: "/asset/77.webp",
    description:
      "تحدي منطقي متعدد الطبقات يعتمد على حل مجموعة من الألغاز المتشابكة في وقت واحد. تحتاج تركيزاً مطلقاً.",
    type: "deep_logic_puzzle", // <--- النوع الجديد
    tags: ["hard", "complex"],
  },

  // 💣 الإضافة الجديدة رقم 3: لعبة سباق الأرقام المتفجرة
  {
    id: 8,
    name: "سباق الأرقام المتفجرة",
    image: "/asset/88.webp",
    description:
      "تخلص من مجموعات الأرقام المتشابهة في شبكة 5x5 قبل أن يصل عداد الانفجار إلى الصفر. حماسية وتتطلب السرعة ضد الذكاء الاصطناعي.",
    type: "blast_numerals", // <--- النوع الجديد
    tags: ["speed", "memory", "ai_opponent"],
  },
  {
    id: 9,
    name: "غزو العقول: اختبار الذكاء الأعلى",
    image: "/asset/99.webp", // صورة جذابة للعبة الذكاء
    description:
      "سلسلة ألغاز منطقية متعددة المستويات. اختبر سرعة تفكيرك وحل الألغاز قبل نفاد الوقت! مثالية لمحبي التحدي العقلي.",
    type: "brain_conquer", // نوع جديد مخصص للألغاز الذهنية
    tags: ["logic", "puzzle", "time_challenge", "advanced"],
  },
];

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
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
              />
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
            {game.type === "brain_conquer" && <BrainConquerGame />}
            {game.type !== "memory" &&
              game.type !== "logic" &&
              game.type !== "speed" &&
              game.type !== "chess" &&
              game.type !== "colorChallenge" &&
              game.type !== "advanced_strategy" &&
              game.type !== "deep_logic_puzzle" && (
                <p className="mt-10 text-lg text-gray-200">
                  🚧 اللعبة {game.name} قيد التطوير حالياً...
                </p>
              )}
          </>
        )}
      </div>
    </div>
  );
}
