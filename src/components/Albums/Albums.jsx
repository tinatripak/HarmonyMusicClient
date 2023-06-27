import Header from "../Header/Header";
import React, { useEffect } from "react";
import { useStateValue } from "../../Context/StateProvider";

import { motion } from "framer-motion";
import { actionType } from "../../Context/reducer";
import { getAllAlbums } from "../../api";
import Footer from "../Footer/Footer";
import AlbumCard from './AlbumCard'

import "../Home/homeStyle.css";

const Albums = () => {
  const [{ allAlbums }, dispatch] = useStateValue();
  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums()
        .then((data) => {
          dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="text-2xl text-center mb-10 mt-10">Альбоми</div>
      {/* <div className="w-full flex items-center justify-center flex-col mb-10"> */}
        <div className="h-auto grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 auto-cols-min gap-4 p-4  mb-10 transition-all">
          {allAlbums?.map((data, index) => (
            <motion.div key={data?._id}>
              <AlbumCard data={data} index={index} />
            </motion.div>
          ))}
        {/* </div> */}
      </div>
      <Footer />
    </div>
  );
};

export default Albums;
