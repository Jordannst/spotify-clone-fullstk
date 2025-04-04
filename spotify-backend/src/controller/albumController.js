import { v2 as cloudinary } from "cloudinary";
import albumModel from "../models/albumModel.js";

const addAlbum = async (req, res) => {
  try {
    const name = req.body.name;
    const desc = req.body.desc;
    const bgColor = req.body.bgColor;
    const imageFile = req.file;
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const albumData = {
      name,
      desc,
      bgColor,
      image: imageUpload.secure_url,
      imagePublicId: imageUpload.public_id, 
    };

    const album = albumModel(albumData);
    await album.save();

    res.json({
      success: true,
      message: "Album added successfully",
    });
  } catch (error) {
    console.error("Error adding album:", error);
    res.status(404).json({
      success: false,
      message: "Failed to add album",
    });
  }
};

const listAlbum = async (req, res) => {
  try {
    const allAlbums = await albumModel.find({});
    res.json({
      success: true,
      albums: allAlbums,
    });
  } catch (error) {
    console.error("Error listing albums:", error);
    res.json({
      success: false,
      message: "Failed to retrieve albums"
    });
  }
};

const removeAlbum = async (req, res) => {
  try {
    // Find the album before deleting to get its Cloudinary ID
    const album = await albumModel.findById(req.body.id);
    
    if (!album) {
      return res.json({
        success: false,
        message: "Album not found"
      });
    }
    
    // Delete image from Cloudinary
    if (album.imagePublicId) {
      await cloudinary.uploader.destroy(album.imagePublicId);
    }
    
    // Delete from database
    await albumModel.findByIdAndDelete(req.body.id);
    
    res.json({
      success: true,
      message: "Album and associated image removed successfully",
    });
  } catch (error) {
    console.error("Error removing album:", error);
    res.json({
      success: false,
      message: "Failed to remove album"
    });
  }
};

export { addAlbum, listAlbum, removeAlbum };