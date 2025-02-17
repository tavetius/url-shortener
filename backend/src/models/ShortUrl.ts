import mongoose from "mongoose";
import shortid from "shortid";

const ShortUrlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  slug: { type: String, default: shortid.generate, unique: true },
}, { timestamps: true });

export default mongoose.model("ShortUrl", ShortUrlSchema);
