import { useEffect, useState } from "react";

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