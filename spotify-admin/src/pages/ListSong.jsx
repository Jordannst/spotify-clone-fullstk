import React, { useState, useEffect } from "react";
import { url } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const ListSong = () => {

    const [data, setData] = useState([]);

    const fetchSongs = async () => {

        try {

          const response = await axios.get(`${url}/api/song/list`);
          if (response.data.success) {

              setData(response.data.songs);

          } else {
             toast.error("Error Occuured");
          }

        }catch (err) {

            console.log(err);
        }
    }

    const removeSong = async (id) => {
      try {

        const response = await axios.post(`${url}/api/song/remove`, {id});
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchSongs();
        }

      }catch (error) {
          toast.error("Error Occuured");
          console.log(error);  
      }
    }

    useEffect(() => {
      fetchSongs();
    },[])


  return (
    <div>
      <p>All Songs List</p>
      <br />
      <div>
        <div className="sm:grid hidden grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 bg-gray-100">
          <b>Image</b>
          <b>Name</b>
          <b>Album</b>
          <b>Duration</b>
          <b>Action</b>
        </div>
        {data.map((item, index) => {
            return (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[0.5fr_1fr_2fr_1fr_0.5fr] items-center gap-2.5 p-3 border border-gray-300 text-sm mr-5 ">
                <img className="w-12" src={item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.album}</p>
                <p>{item.duration}</p>
                <button onClick={() => removeSong(item._id)} className="bg-green-600 text-white px-1 py-1 mr-5 rounded cursor-pointer hover:bg-green-700 hover:scale-103 active:scale-95">Delete</button>
              </div>
            )
        })}
      </div>
    </div>
  )
};

export default ListSong;
