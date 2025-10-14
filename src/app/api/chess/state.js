import dbConnect from "@/lib/mongodb";
import ChessGame from "@/models/ChessGame";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const { gameId } = req.query;
  if (!gameId) return res.status(400).json({ error: "Missing gameId" });

  await dbConnect();

  const game = await ChessGame.findById(gameId);
  if (!game) return res.status(404).json({ error: "Game not found" });

  res.status(200).json(game);
}
