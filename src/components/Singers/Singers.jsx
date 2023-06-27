import Header from "../Header/Header";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { useStateValue } from "../../Context/StateProvider";
import { actionType } from "../../Context/reducer";
import { getAllArtist, getAllSongsInAsc } from "../../api";
import { useNavigate } from "react-router-dom";
import "../Home/homeStyle.css";
import Footer from "../Footer/Footer";
import './singers.css'

const Artists = () => {
  const [{ artists, allSongs, isSongPlaying }, dispatch] = useStateValue();
  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [artists, dispatch]);

  useEffect(() => {
    if (!allSongs) {
      getAllSongsInAsc().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.data,
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [allSongs, dispatch]);
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="text-2xl text-center mb-10 mt-10">Виконавці</div>
      <div className="h-auto grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 auto-cols-min gap-4 p-4  mb-10 transition-all">
        {artists?.map((data, index) => (
          <motion.div key={data?._id}>
            <ArtistCard data={data} index={index} />
          </motion.div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export const ArtistCard = ({ data, index }) => {
  const navigate = useNavigate();
  const handleClick = () => navigate(`/albumsAndSonsBySinger/${data?.name}`);

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="hover:scale-105 relative px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-white bg-card shadow-md rounded-lg height-block"
      onClick={() => handleClick()}
    >
      <img
        src={data?.imageURL}
        className="w-52 h-52 rounded-lg drop-shadow-lg relative object-cover overflow-hidden px-2"
        alt=""
      />

      <p className="text-headingColor text-center font-black my-2 px-2 ">{data?.name}</p>

      <div className="flex justify-center gap-10 items-center">
        {data?.instagram !== "" && (
          <a
            href={`https://www.instagram.com/${data?.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoInstagram className="text-yellow-500 hover:text-yellow-600 text-xl" />
            </motion.i>
          </a>
        )}
        {data?.twitter !== "" && (
          <a
            href={`https://twitter.com/${data?.twitter}`}
            target="_blank"
            rel="noreferrer"
          >
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoTwitter className="text-blue-500 hover:text-blue-600 text-xl" />
            </motion.i>
          </a>
        )}
      </div>

    </motion.div>
  );
};

export default Artists;
