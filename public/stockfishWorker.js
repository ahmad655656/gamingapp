importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish/10.0.2/stockfish.js');

const engine = STOCKFISH();

engine.onmessage = (event) => postMessage(event.data);

onmessage = (e) => engine.postMessage(e.data);
