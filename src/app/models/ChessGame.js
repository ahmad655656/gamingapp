import mongoose from "mongoose";

const ChessGameSchema = new mongoose.Schema({
  board: { type: [[String]], required: true },
  turn: { type: String, default: "white" },
  lastMove: { type: Object, default: null },
}, { timestamps: true });

export default mongoose.models.ChessGame || mongoose.model("ChessGame", ChessGameSchema);
