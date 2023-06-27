import React, { useEffect, useState } from "react";
import { useStateValue } from "../../../Context/StateProvider";
import { motion } from "framer-motion";
import { ImCross } from "react-icons/im";
import { actionType } from "../../../Context/reducer";
import {
  deleteAlbumById,
  deleteSongsByAlbum,
  getAllAlbums,
  getAllSongsInAsc,
} from "../../../api";
import { NavLink, useNavigate } from "react-router-dom";
import { IoAdd } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";

const DashboardAlbum = () => {
  const [{ allAlbums }, dispatch] = useStateValue();
  const [updatedAlbums, setUpdatedAlbums] = useState(false);

  useEffect(() => {
    if (!allAlbums || updatedAlbums) {
      getAllAlbums()
        .then((data) => {
          dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
          setUpdatedAlbums(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [allAlbums, updatedAlbums]);

  const handleAlbumUpdate = () => {
    setUpdatedAlbums(true);
  };

  const deleteAlbum = (id, name) => {
    deleteAlbumById(id).then((res) => {
      if (res.data.success) {
        handleAlbumUpdate();
        getAllAlbums().then((data) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMNS,
            allAlbums: data.data,
          });
        }).catch((error) => {
          console.error(error);
        })
        alert("Успішно видалено");
      }
    }).catch((error) => {
      console.error(error);
    });
    deleteSongsByAlbum(name).then((res) => {
      if (res.data.success) {
        handleAlbumUpdate();
        getAllSongsInAsc().then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        }).catch((error) => {
          console.error(error);
        });
        alert("Успішно видалено");
      }
    }).catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <NavLink
        to={"/dashboard/newAlbum"}
        className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
      >
        <IoAdd />
      </NavLink>

      <div className="relative w-full my-4 p-4 py-12 border border-gray-300 rounded-md  ">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Кількість : <span className="text-xl">{allAlbums?.length}</span>
            </span>
          </p>
        </div>
        <div className=" w-full gap-10 my-4 p-4 py-8 flex flex-wrap justify-center">
          {allAlbums?.map((data, index) => (
            <motion.div key={data?._id}>
              <AlbumCard
                key={data?._id}
                data={data}
                index={data?._id}
                onDelete={() => deleteAlbum(data?._id, data?.name)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AlbumCard = ({ data, index, onDelete }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const navigate = useNavigate();

  const navigateToEditAlbum = () => {
    navigate(`/dashboard/editAlbum/${data?._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative  overflow-hidden w-40 min-w-210 px-6 py-6 gap-3 cursor-pointer hover:shadow-xl hover:bg-white bg-card shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.imageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />
      <p className="text-base text-textColor">{data?.name}</p>
      <div className="flex">
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

export default DashboardAlbum;
