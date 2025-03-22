import mongoose from "mongoose";

// create a schema for the album model
const albumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  bgColor: { type: String, required: true },
  image: { type: String, required: true },
});

const albumModel = mongoose.models.album || mongoose.model("album", albumSchema)

export default albumModel;
