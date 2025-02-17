import express, { Application, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as dotenv from "dotenv";
import ShortUrl from "./models/ShortUrl";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

app.post("/api/shorten", async (req: Request, res: Response): Promise<void> => {
  const { originalUrl } = req.body;
  if (!originalUrl) {
    res.status(400).json({ error: "URL is required" });
    return;
  }

  const existing = await ShortUrl.findOne({ originalUrl });
  if (existing) {
    res.json({ shortUrl: `${process.env.BASE_URL}/${existing.slug}` });
    return;
  }

  const shortUrl = new ShortUrl({ originalUrl });
  await shortUrl.save();

  res.json({ shortUrl: `${process.env.BASE_URL}/${shortUrl.slug}` });
});

app.get("/:slug", async (req: Request, res: Response): Promise<void> => {
  const { slug } = req.params;
  const urlEntry = await ShortUrl.findOne({ slug });

  if (urlEntry) {
    res.redirect(urlEntry.originalUrl);
    return;
  }

  res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
