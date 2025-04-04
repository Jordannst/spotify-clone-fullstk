import React, { useState, useEffect } from "react";
import { url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const ListAlbum = () => {
    const [data, setData] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);

    const fetchAlbums = async () => {
        try {
            const response = await axios.get(`${url}/api/album/list`);
            if (response.data.success) {
                setData(response.data.albums);
            } else {
                toast.error("Error Occurred");
            }
        } catch (err) {
            console.log(err);
            toast.error("Error Occurred");
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedAlbumId(id);
        setShowConfirmation(true);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.post(`${url}/api/album/remove`, { id: selectedAlbumId });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchAlbums();
            }
        } catch (error) {
            toast.error("Error Occurred");
            console.log(error);
        } finally {
            setShowConfirmation(false);
            setSelectedAlbumId(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmation(false);
        setSelectedAlbumId(null);
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    return (
        <div>
            <p>All Albums List</p>
            <br />
            <div>
                <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Description</b>
                    <b>Album Color</b>
                    <b>Action</b>
                </div>
                {data.map((item, index) => {
                    return (
                        <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 ">
                            <img className="w-12" src={item.image} alt="" />
                            <p>{item.name}</p>
                            <p>{item.desc}</p>
                            <input type="color" value={item.bgColor} readOnly disabled />
                            <button
                                onClick={() => handleDeleteClick(item._id)}
                                className="bg-red-600 text-white px-1 py-1 mr-5 rounded cursor-pointer hover:bg-red-700 hover:scale-103 active:scale-95"
                            >
                                Delete
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Delete Confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 backdrop-blur-sm bg-transparent bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete this album?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListAlbum;