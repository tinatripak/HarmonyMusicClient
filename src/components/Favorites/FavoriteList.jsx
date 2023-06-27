import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { getFavourites, getSongsByIds } from "../../api";
import { useStateValue } from "../../Context/StateProvider";
import { MusicSongContainer } from "../Music/Music";
import { motion } from "framer-motion";
import MusicPlayer from "../Music/MusicPlayer";

const FavoriteList = () => {
  const [list, setList] = useState([]);
  const [{ user, isSongPlaying }, dispatch] = useStateValue();

  const fetchList = async () => {
    console.log("2",user)
    
    if (user?.user?._id) {
      const response = await getFavourites(user?.user._id);
      const songsData = await getSongsByIds(response?.data);
      setList(songsData?.data);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        console.log("1",user)
        await fetchList();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary pl-1 ">
      <Header />
      <div className="text-2xl mb-10 mt-10">Улюблені пісні</div>
      <div className="h-auto grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 auto-cols-min gap-4 p-4  mb-10 transition-all">
        {list && <MusicSongContainer musics={list} />}
      </div>
      {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
        >
          <MusicPlayer musics={list} />
        </motion.div>
      )}
      <Footer />
    </div>
  );
};

export default FavoriteList;
