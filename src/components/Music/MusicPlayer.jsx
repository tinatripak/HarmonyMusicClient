import React, { useEffect, useRef, useState } from "react";
import { useStateValue } from "../../Context/StateProvider";
import { IoMdClose } from "react-icons/io";
import { IoArrowRedo } from "react-icons/io5";
import { motion } from "framer-motion";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../../Context/reducer";

const MusicPlayer = ({ musics }) => {
  const [{ song, isSongPlaying, miniPlayer, currentTime }, dispatch] = useStateValue();
  const [currentTimeSong, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const closeMusicPlayer = () => {
    if (isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: false,
      });
    }
  };

  const togglePlayer = () => {
    if (miniPlayer) {
      dispatch({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: false,
      });
    } else {
      dispatch({
        type: actionType.SET_MINI_PLAYER,
        miniPlayer: true,
      });
    }
  };

  const nextTrack = () => {
    if (song > musics.length) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    } else {
      if(song+1 !== musics.length){
        dispatch({
          type: actionType.SET_SONG,
          song: song + 1,
        });
      } else{
        dispatch({
          type: actionType.SET_SONG,
          song: 0,
        });
      }
    }
  };

  const previousTrack = () => {
    if (song === 0) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG,
        song: song - 1,
      });
    }
  };

  useEffect(() => {
    if (song > musics.length) {
      dispatch({
        type: actionType.SET_SONG,
        song: 0,
      });
    }
    dispatch({
      type: actionType.SET_CURRENT_TIME,
      currentTime: currentTimeSong,
    });

    if (audioRef.current) {
      audioRef.current.audio.current.currentTime = currentTime;
    }
  }, [song]);

  return (
    <div className="w-full full flex items-center gap-3 overflow-hidden">
      <div
        className={`w-full full items-center gap-3 p-4 ${
          miniPlayer ? "absolute top-40" : "flex relative"
        }`}
      >
        <img
          src={musics[song]?.imageURL}
          className="w-40 h-20 object-cover rounded-md"
          alt=""
        />
        <div className="flex items-start flex-col">
          <p className="text-xl text-headingColor font-semibold">
            {`${
              musics[song]?.name.length > 20
                ? musics[song]?.name.slice(0, 20)
                : musics[song]?.name
            }`}{" "}
          </p>
          <p className="text-base">{musics[song]?.album}, {musics[song]?.artist}{" "}</p>
        </div>
        <div className="flex-1">
          <AudioPlayer
            src={musics[song]?.songUrl}
            onPlay={() => console.log(musics[song]?.name,"грає")}
            autoPlay={true}
            showSkipControls={true}
            onClickNext={nextTrack}
            onClickPrevious={previousTrack}
            onListen={(e) => setCurrentTime(e.target.currentTime)}
            ref={audioRef}
          />
        </div>
        <div className="h-full flex items-center justify-center flex-col gap-3">
          <motion.i whileTap={{ scale: 0.8 }} onClick={closeMusicPlayer}>
            <IoMdClose className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
          <motion.i whileTap={{ scale: 0.8 }} onClick={togglePlayer}>
            <IoArrowRedo className="text-textColor hover:text-headingColor text-2xl cursor-pointer" />
          </motion.i>
        </div>
      </div>

      {miniPlayer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed right-2 bottom-2 "
        >
          <div className="w-40 h-40 rounded-full flex items-center justify-center  relative ">
            <div className="absolute inset-0 rounded-full bg-gray-200 blur-xl animate-pulse"></div>
            <img
              onClick={togglePlayer}
              src={musics[song]?.imageURL}
              className="z-50 w-32 h-32 rounded-full object-cover cursor-pointer"
              alt=""
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MusicPlayer;
