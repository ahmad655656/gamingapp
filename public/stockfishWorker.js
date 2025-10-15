// public/stockfishWorker.js
importScripts("/stockfish.js");

const engine = typeof STOCKFISH === "function" ? STOCKFISH() : null;

if (engine) {
  engine.onmessage = (event) => postMessage(event.data);
  onmessage = (e) => engine.postMessage(e.data);
} else {
  postMessage("خطأ: لم يتم تحميل محرك Stockfish بشكل صحيح!");
}
