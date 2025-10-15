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
    id: 9,
    name: "سباق الأرقام المتفجرة",
    image: "https://images.pexels.com/photos/4030088/pexels-photo-4030088.jpeg",
    description: "تخلص من مجموعات الأرقام المتشابهة في شبكة 5x5 قبل أن يصل عداد الانفجار إلى الصفر. حماسية وتتطلب السرعة ضد الذكاء الاصطناعي.",
    type: "blast_numerals", // <--- النوع الجديد
    tags: ["speed", "memory", "ai_opponent"],
  },
];