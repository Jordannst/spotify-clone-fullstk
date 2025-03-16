import express from "express";
import cors from "cors";
import "dotenv/config";
// import mongoose from 'mongoose'

// app config
const app = express();
const port = process.env.port || 3000;

// middleware
app.use(express.json());
app.use(cors());

// initializing routes
app.use("/api/songs", require("./src/routes/songRoute"));

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log(`Server running on ${port}`));
