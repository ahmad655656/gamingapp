import dbConnect from "@/lib/mongodb";
import ChessGame from "@/models/ChessGame";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { gameId, from, to } = req.body;
  if (!gameId || !from || !to) return res.status(400).json({ error: "Missing params" });

  await dbConnect();

  const game = await ChessGame.findById(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  const { board, turn } = game;
  const piece = board[from.row][from.col];
  if (!piece) return res.status(400).json({ error: "No piece at from" });

  const isWhite = (p) => p && "♙♖♘♗♕♔".includes(p);
  const isBlack = (p) => p && "♟♜♞♝♛♚".includes(p);

  if ((turn === "white" && !isWhite(piece)) || (turn === "black" && !isBlack(piece))) {
    return res.status(400).json({ error: "Not your turn" });
  }

  // أبسط تحريك بدون قواعد شطرنج
  const newBoard = board.map(r => [...r]);
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;

  game.board = newBoard;
  game.turn = turn === "white" ? "black" : "white";
  game.lastMove = { from, to, piece };
  await game.save();

  res.status(200).json(game);
}
