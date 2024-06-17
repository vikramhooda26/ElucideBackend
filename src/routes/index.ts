import express from "express";

const app = express();

app.post("/api/user", async (req, res) => {
  res.json({ success: true });
});
