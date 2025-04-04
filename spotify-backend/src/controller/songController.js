import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const album = req.body.album;
    const audioFile = req.files.audio[0];
    const imageFile = req.files.image[0];
    const audioUpload = await cloudinary.uploader.upload(audioFile.path, {
      resource_type: "video",
    });
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(
      audioUpload.duration % 60
    )}`;

    const songData = {
      name,
      desc,
      album,
      image: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id,
      file: audioUpload.secure_url,
      audioPublicId: audioUpload.public_id,
      duration,
    };

    const song = songModel(songData);
    await song.save();

    res.json({
      success: true,
      message: "Song added successfully",
    });
  } catch (error) {
    console.error("Error adding song:", error);
    res.json({
      success: false,
      message: "Failed to add song"
    });
  }
};

const listSong = async (req, res) => {
  try {
    const allSongs = await songModel.find({});
    res.json({
      success: true,
      songs: allSongs,
    });
  } catch (error) {
    console.error("Error listing songs:", error);
    res.json({
      success: false,
      message: "Failed to retrieve songs"
    });
  }
};

const removeSong = async (req, res) => {
  try {
    // Find the song before deleting to get its Cloudinary IDs
    const song = await songModel.findById(req.body.id);
    
    if (!song) {
      return res.json({
        success: false,
        message: "Song not found"
      });
    }
    
    // Delete from Cloudinary
    if (song.imagePublicId) {
      await cloudinary.uploader.destroy(song.imagePublicId);
    }
    
    if (song.audioPublicId) {
      await cloudinary.uploader.destroy(song.audioPublicId, { resource_type: "video" });
    }
    
    // Delete from database
    await songModel.findByIdAndDelete(req.body.id);
    
    res.json({
      success: true,
      message: "Song and associated files removed successfully",
    });
  } catch (error) {
    console.error("Error removing song:", error);
    res.json({
      success: false,
      message: "Failed to remove song"
    });
  }
};

export { addSong, listSong, removeSong };


