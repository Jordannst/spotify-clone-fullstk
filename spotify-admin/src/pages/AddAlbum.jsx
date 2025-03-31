import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { url } from "../App";
import axios from "axios";

const AddAlbum = () => {
    const [image, setImage] = useState(false);
    const [color, setColor] = useState("#121212");
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        let progressInterval;
        
        if (isUploading && uploadProgress < 90) {
            progressInterval = setInterval(() => {
                setUploadProgress(prevProgress => {
                    // Hitung nilai progress baru yang bergerak lebih cepat di awal dan lebih lambat saat mendekati 90%
                    const increment = Math.max(1, Math.floor((90 - prevProgress) / 10));
                    const newProgress = Math.min(90, prevProgress + increment);
                    return newProgress;
                });
            }, 300);
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [isUploading, uploadProgress]);

    const formatFileSize = (size) => {
        if (size < 1024) return size + ' B';
        else if (size < 1048576) return (size / 1024).toFixed(1) + ' KB';
        else return (size / 1048576).toFixed(1) + ' MB';
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (!image) {
            toast.error("Please upload an image file");
            return;
        }
        
        setLoading(true);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("desc", desc);
            formData.append("image", image);
            formData.append("bgColor", color);
            
            const response = await axios.post(`${url}/api/album/add`, formData);
            
            // Set ke 100% saat upload selesai
            setUploadProgress(100);
            
            // Delay untuk menunggu upload selesai
            setTimeout(() => {
                if (response.data.success) {
                    toast.success("Album added successfully");
                    setDesc("");
                    setImage(false);
                    setName("");
                    setColor("#121212");
                    setLoading(false);
                    setIsUploading(false);
                } else {
                    toast.error("Something went wrong");
                    setLoading(false);
                    setIsUploading(false);
                }
            }, 500);

        } catch (error) {
            toast.error("Error occurred while adding album");
            console.log(error);
            setLoading(false);
            setIsUploading(false);
        }
    }

    return loading ? (
        <div className="grid place-items-center min-h-[80vh]">
            {isUploading ? (
                <div className="flex flex-col items-center w-full max-w-md">
                    <div className="w-full bg-gray-200 h-6 rounded-full overflow-hidden mb-4">
                        <div 
                            className="h-full bg-green-600 transition-all duration-300 flex items-center justify-center"
                            style={{ width: `${uploadProgress}%` }}
                        >
                            <span className="text-white text-xs font-medium">
                                {uploadProgress < 100 ? 'Uploading...' : 'Complete!'}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">{uploadProgress}%</p>
                    <p className="text-gray-500 text-sm mt-2">
                        {uploadProgress < 100 
                            ? "Please wait while your album is being created..." 
                            : "Upload complete!"}
                    </p>
                </div>
            ) : (
                <div className="w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin"></div>
            )}
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className="flex flex-col items-start gap-8 text-gray-600">
            <div className="flex flex-col gap-4">
                <p>Upload Image</p>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" accept="image/*" hidden />
                <label htmlFor="image">
                    <img className="w-24 cursor-pointer" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                </label>
                {image && (
                    <div className="text-sm text-gray-500">
                        <p className="font-medium truncate max-w-xs">{image.name}</p>
                        <p>{formatFileSize(image.size)}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Album name</p>
                <input 
                    onChange={(e) => setName(e.target.value)} 
                    value={name} 
                    className="bg-transparent rounded outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw] min-w-[250px]" 
                    type="text" 
                    placeholder="Type here" 
                    required 
                />
            </div>

            <div className="flex flex-col gap-2.5">
                <p>Album description</p>
                <input 
                    onChange={(e) => setDesc(e.target.value)} 
                    value={desc} 
                    className="bg-transparent rounded outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw] min-w-[250px]" 
                    type="text" 
                    placeholder="Type here" 
                    required 
                />
            </div>

            <div className="flex flex-col gap-3">
                <p>Background Color</p>
                <input 
                    onChange={(e) => setColor(e.target.value)} 
                    value={color} 
                    className="rounded-2xl cursor-pointer" 
                    type="color" 
                />
            </div>

            <button 
                className="text-base bg-black text-white py-2.5 px-14 cursor-pointer rounded-2xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition" 
                type="submit"
            >
                Add
            </button>
        </form>
    );
}

export default AddAlbum;