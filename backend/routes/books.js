import express from "express";

const router = express.Router();

router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Query required" });
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        q
      )}&maxResults=12&printType=books&key=${process.env.GOOGLE_BOOKS_KEY}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: "Google API error" });
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("Books API Error:", error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
});

export default router;