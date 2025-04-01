import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import { url } from '../App';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddSong = () => {
    const [image, setImage] = useState(false);
    const [song, setSong] = useState(false);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [album, setAlbum] = useState("none");
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [albumData, setAlbumData] = useState([]);

    
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

    const onSubmitHandler = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior (prevents page reload)

        if (!song || !image) {
            toast.error("Please upload both song and image files");
            return;
        }

        setLoading(true);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('desc', desc);
            formData.append('image', image);
            formData.append('audio', song);
            formData.append('album', album);
            
            const response = await axios.post(`${url}/api/song/add`, formData);
                
            // Set to 100% when upload is complete
            setUploadProgress(100);
            
            // Add a small delay before hiding the progress bar to show 100%
            setTimeout(() => {
                if (response.data.success) {
                    toast.success("Song added successfully");
                    setName("");
                    setDesc("");
                    setAlbum("none");
                    setImage(false);
                    setSong(false);
                    setLoading(false);
                    setIsUploading(false);
                } else {
                    toast.error("Something went wrong");
                    setLoading(false);
                    setIsUploading(false);
                }
            }, 500);
            
        } catch (err) {
            console.log(err);
            toast.error("Error occurred while adding song");
            setLoading(false);
            setIsUploading(false);
        }
    }

    const loadAlbumData = async () => {
        
        try {

            const response = await axios.get(`${url}/api/album/list`);

            if (response.data.success) {
                setAlbumData(response.data.albums);
            } else {
                toast.error("Unable to load albums data")
            }

        } catch (error) {
            toast.error("Error Occured", error)
        }
    }

    useEffect(() => {
        loadAlbumData();
    },[])

    const formatFileSize = (size) => {
        if (size < 1024) return size + ' B';
        else if (size < 1048576) return (size / 1024).toFixed(1) + ' KB';
        else return (size / 1048576).toFixed(1) + ' MB';
    };

    return loading ? (
        <div className='grid place-items-center min-h-[80vh]'>
            {isUploading ? (
                <div className='flex flex-col items-center w-full max-w-md'>
                    <div className='w-full bg-gray-200 h-6 rounded-full overflow-hidden mb-4'>
                        <div 
                            className='h-full bg-green-600 transition-all duration-300 flex items-center justify-center'
                            style={{ width: `${uploadProgress}%` }}
                        >
                            <span className='text-white text-xs font-medium'>
                                {uploadProgress < 100 ? 'Uploading...' : 'Complete!'}
                            </span>
                        </div>
                    </div>
                    <p className='text-gray-600 font-medium'>{uploadProgress}%</p>
                    <p className='text-gray-500 text-sm mt-2'>
                        {uploadProgress < 100 
                            ? "Please wait while your song is being uploaded..." 
                            : "Upload complete!"}
                    </p>
                </div>
            ) : (
                <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
            )}
        </div>
    ) : (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
            <div className='flex gap-8'>
                <div className='flex flex-col gap-4'>
                    <p>Upload song</p>
                    <input onChange={(e) => setSong(e.target.files[0])} type='file' id='song' accept='audio/*' hidden />
                    <label htmlFor='song'>
                        <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt='' />
                    </label>
                    {song && (
                        <div className='text-sm text-gray-500'>
                            <p className='font-medium truncate max-w-xs'>{song.name}</p>
                            <p>{formatFileSize(song.size)}</p>
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-4'>
                    <p>Upload Image</p>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
                    </label>
                    {image && (
                        <div className='text-sm text-gray-500'>
                            <p className='font-medium truncate max-w-xs'>{image.name}</p>
                            <p>{formatFileSize(image.size)}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Song name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className="bg-transparent rounded outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw] min-w-[250px]" placeholder="Type Here" type="text" required />
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Song description</p>
                <input onChange={(e) => setDesc(e.target.value)} value={desc} className="bg-transparent rounded outline-green-600 border-2 border-gray-400 p-2.5 w-[40vw] min-w-[250px]" placeholder="Type Here" type="text" required />
            </div>

            <div className='flex flex-col gap-2.5'>
                <p>Album</p>
                <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent rounded-2xl outline-green-600 border-2 border-gray-400 p-2.5 w-[150px] '>
                    <option value="none">None</option>
                    {albumData.map((item, index) =>(<option key={index} value={item.name}>{item.name}</option>))}
                </select> 
            </div>

            <button type='submit' className='text-base bg-black text-white py-2.5 px-14 cursor-pointer rounded-2xl hover:bg-gray-800 hover:scale-105 active:scale-95 transition'>Add</button>
        </form>
    );
};

export default AddSong;