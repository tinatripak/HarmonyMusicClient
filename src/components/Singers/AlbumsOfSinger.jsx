import React, { useState, useEffect } from "react";
import { getAlbumsBySinger, getSongsBySinger } from "../../api";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../Header/Header";
import MusicPlayer from "../Music/MusicPlayer";
import { useStateValue } from "../../Context/StateProvider";
import { MusicSongContainer } from "../Music/Music";
import Footer from "../Footer/Footer";
import AlbumCard from "../Albums/AlbumCard";

const AlbumsBySinger = () => {
  const { name } = useParams();
  const [albums, setAlbums] = useState([]);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    async function fetchAlbums() {
      const response = await getAlbumsBySinger(name);
      setAlbums(response.data);
    }
    (async () => {
      try {
        await fetchAlbums();
      } catch (error) {
        console.error(error);
      }
    })();

    async function fetchSongs() {
      const response = await getSongsBySinger(name);
      setSongs(response.data);
    }
    (async () => {
      try {
        await fetchSongs();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [name]);
  const [{ isSongPlaying }] = useStateValue();

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary  pl-1">
      <Header />
      <div className="mt-6 text-2xl font-semibold">{name}</div>
      <div className="text-xl text-center my-4">Усі альбоми</div>
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="flex items-center justify-evenly gap-4 flex-wrap p-4 w-3/4">
          {albums?.map((data, index) => (
            <motion.div key={data?._id}>
              <AlbumCard data={data} index={index} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-xl text-center my-4">Усі пісні</div>
      <div className="w-full flex items-center justify-center flex-col ">
        <div className="flex items-center justify-evenly gap-4 flex-wrap p-4 mb-5">
          {songs && songs.length > 0 && <MusicSongContainer musics={songs} />}
          {isSongPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
            >
              <MusicPlayer musics={songs} />
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AlbumsBySinger;
