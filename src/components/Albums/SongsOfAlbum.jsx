import React, { useState, useEffect } from "react";
import { getSongsByAlbum } from "../../api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import { useStateValue } from "../../Context/StateProvider";
import { actionType } from "../../Context/reducer";
import SongPlayer from "./SongPlayer";
import Footer from "../Footer/Footer";

const SongsOfAlbum = () => {
  const { singer, name } = useParams();
  const [songs, setSongs] = useState([]);

  const [{ isSongPlaying }] = useStateValue();

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const response = await getSongsByAlbum(name);
        setSongs(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    (async () => {
      try {
        await fetchAlbums();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [name]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="text-2xl text-center mb-10 mt-10">
        Пісні виконавця {singer} з альбому "{name}"
      </div>
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="flex items-center justify-evenly gap-4 flex-wrap p-4 w-3/4 mb-10 min-h-350">
          {songs?.map((data, index) => (
            <motion.div key={data?._id}>
              <SongContainer data={data} index={index} />
            </motion.div>
          ))}
          {isSongPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
            >
              <SongPlayer allSongs={songs} />
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SongContainer = ({ data, index }) => {
  const [{ isSongPlaying, song }, dispatch] = useStateValue();

  const addSongToContext = (index) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }
    if (song !== index) {
      dispatch({
        type: actionType.SET_SONG,
        song: index,
      });
    }
  };
  return (
    <motion.div
      key={data?._id}
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
      onClick={() => addSongToContext(index)}
    >
      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data?.imageURL}
          alt="Songs?"
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="text-base text-headingColor font-semibold my-2 text-center">
        {data?.name.length > 25 ? `${data?.name.slice(0, 25)}` : data?.name}
      </p>
    </motion.div>
  );
};

export default SongsOfAlbum;
