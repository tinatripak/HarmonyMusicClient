import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useStateValue } from "../../../Context/StateProvider";
import { IoAdd, IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import {
  deleteAlbumsBySinger,
  deleteSingerById,
  deleteSongsBySinger,
  getAllAlbums,
  getAllArtist,
  getAllSongsInAsc,
} from "../../../api";
import { actionType } from "../../../Context/reducer";
import { ImCross } from "react-icons/im";
import { NavLink, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";

const DashboardArtist = () => {
  const [{ artists }, dispatch] = useStateValue();
  const [updatedSingers, setUpdatedSingers] = useState(false);

  useEffect(() => {
    if (!artists || updatedSingers) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
        setUpdatedSingers(false);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [artists, updatedSingers]);

  const handleSingerUpdate = () => {
    setUpdatedSingers(true);
  };

  const deleteSinger = (id, name) => {
    deleteSingerById(id).then((res) => {
      if (res.data.success) {
        handleSingerUpdate();
        getAllArtist().then((data) => {
          dispatch({
            type: actionType.SET_ARTISTS,
            artists: data.data,
          });
        }).catch((error) => {
          console.error(error);
        }); 
        console.log("Усішно видалено");
      }
    }).catch((error) => {
      console.error(error);
    });
    deleteSongsBySinger(name).then((res) => {
      if (res.data.success) {
        handleSingerUpdate();
        getAllSongsInAsc().then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        }).catch((error) => {
          console.error(error);
        });
        console.log("Усішно видалено");
      }
    }).catch((error) => {
      console.error(error);
    });
    deleteAlbumsBySinger(name).then((res) => {
      if (res.data.success) {
        handleSingerUpdate();
        getAllAlbums().then((data) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMNS,
            allAlbums: data.data,
          });
        }).catch((error) => {
          console.error(error);
        });
        console.log("Усішно видалено");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <NavLink
        to={"/dashboard/newArtist"}
        className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
      >
        <IoAdd />
      </NavLink>
      <div className="relative w-full my-4 p-4 py-12 border border-gray-300 rounded-md">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Кількість : <span className="text-xl">{artists?.length}</span>
            </span>
          </p>
        </div>
        <div className="">
          <div className="relative w-full gap-10 my-4 p-4 py-8 flex flex-wrap justify-center">
            {artists?.map((data, index) => (
              <motion.div key={data?._id}>
                <ArtistCard
                  key={data?._id}
                  data={data}
                  index={index}
                  onDelete={() => deleteSinger(data?._id, data?.name)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ArtistCard = ({ data, index, onDelete }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const navigate = useNavigate();
  const navigateToEditAlbum = () => {
    navigate(`/dashboard/editSinger/${data?._id}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-40 min-w-210 px-6 pt-4 gap-2 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-50 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.imageURL}
        className="w-full h-40 object-cover rounded-md mt-2"
        alt=""
      />

      <p className="font-semibold text-textColor">{data?.name}</p>
      <div className="flex items-center gap-4">
        {data?.instagram !== "" && (
          <a
            href={`https://www.instagram.com/${data?.instagram}`}
            target="_blank"
          >
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoInstagram className="text-yellow-500 hover:text-yellow-600 text-xl" />
            </motion.i>
          </a>
        )}
        {data?.twitter !== "" && (
          <a href={`https://twitter.com/${data?.twitter}`} target="_blank">
            <motion.i whileTap={{ scale: 0.75 }}>
              <IoLogoTwitter className="text-blue-500 hover:text-blue-600 text-xl" />
            </motion.i>
          </a>
        )}
      </div>

      <div className="flex mb-4">
        <div>Редагувати</div>
        <MdModeEdit onClick={navigateToEditAlbum} className="ml-3" size={20} />
      </div>

      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute inset-0 p-2 bg-darkOverlay  backdrop-blur-md flex flex-col items-center justify-center gap-4"
        >
          <p className="text-gray-100 font-semibold text-center">
            Ти бажаєш видалити {data?.name}?
          </p>
          <div className="flex items-center w-full justify-center gap-3">
            <div className="bg-red-600 px-4 hover:scale-125 rounded-xl">
              <button
                className="text-headingColor text-sm"
                onClick={() => {
                  onDelete();
                  setIsDeleted(false);
                }}
              >
                Так!
              </button>
            </div>
            <button
              className="bg-green-600 px-4 hover:scale-125 rounded-xl"
              onClick={() => setIsDeleted(false)}
            >
              Ні!
            </button>
          </div>
        </motion.div>
      )}
      {!isDeleted && (
        <motion.div
          whileTap={{ scale: 0.5 }}
          className="absolute right-0 -top-1 w-8 h-8 rounded-md flex items-center justify-center"
          onClick={() => setIsDeleted(true)}
        >
          <ImCross
            className="text-xl text-red-600 hover:text-red-700"
            size={17}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default DashboardArtist;
