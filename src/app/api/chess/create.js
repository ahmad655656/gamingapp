import dbConnect from "@/lib/mongodb";
import ChessGame from "@/models/ChessGame";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  await dbConnect();

  const initialBoard = [
    ["♜","♞","♝","♛","♚","♝","♞","♜"],
    ["♟","♟","♟","♟","♟","♟","♟","♟"],
    ...Array(4).fill(Array(8).fill(null)),
    ["♙","♙","♙","♙","♙","♙","♙","♙"],
    ["♖","♘","♗","♕","♔","♗","♘","♖"],
  ];

  const game = new ChessGame({ board: initialBoard, turn: "white" });
  await game.save();

  res.status(200).json(game);
}
