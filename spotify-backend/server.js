import express from "express";
import cors from "cors";
import "dotenv/config";
import songRouter from "./src/routes/songRoute.js";
import albumRoute from "./src/routes/albumRoute.js";
import connectDB from "./src/config/mongodb.js";
import connectCloudinary from "./src/config/cloudinary.js";

// app config
const app = express();
const port = process.env.port || 3000;
connectDB();
connectCloudinary();

// middleware
app.use(express.json());
app.use(cors());

// initializing routes
app.use("/api/song", songRouter);
app.use("/api/album", albumRoute);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(port, () => console.log(`Server running on ${port}`));
