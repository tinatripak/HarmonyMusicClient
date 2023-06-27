import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GrClearOption } from "react-icons/gr";
import { deleteSongById, getAllSongsInAsc } from "../../../api";
import { useStateValue } from "../../../Context/StateProvider";
import { actionType } from "../../../Context/reducer";
import { IoAdd } from "react-icons/io5";
import { ImCross } from "react-icons/im";

import { NavLink, useNavigate } from "react-router-dom";
import AlertSuccess from "../../Alerts/AlertSuccess";
import AlertError from "../../Alerts/AlertError";
import { MdModeEdit } from "react-icons/md";

const DashboardSongs = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);

  const [{ allSongs }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allSongs) {
      getAllSongsInAsc()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (songFilter.length > 0) {
      const filtered = allSongs.filter(
        (data) =>
          data?.artist.toLowerCase().includes(songFilter) ||
          data?.language.toLowerCase().includes(songFilter) ||
          data?.name.toLowerCase().includes(songFilter)
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/dashboard/newSong"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Я шукаю ..."
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-full bg-card outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          value={songFilter}
          onChange={(e) => setSongFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {songFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setSongFilter("");
              setFilteredSongs(null);
            }}
          >
            <GrClearOption className="text-3xl text-textColor cursor-pointer" />
          </motion.i>
        )}
      </div>

      <div className="relative w-full my-4 p-4 py-12 border border-gray-300 rounded-md">
        <div className="absolute top-4 left-4">
          <p className="text-xl font-bold">
            <span className="text-sm font-semibold text-textColor">
              Кількість :{" "}
            </span>
            {filteredSongs ? filteredSongs?.length : allSongs?.length}
          </p>
        </div>

        <SongContainer data={filteredSongs ? filteredSongs : allSongs} />
      </div>
    </div>
  );
};

export const SongContainer = ({ data }) => {
  return (
    <div className="relative w-full gap-10 my-4 p-4 py-8 flex flex-wrap justify-center">
      {data?.map((song, i) => (
        <SongCard key={song._id} data={song} index={i} />
      ))}
    </div>
  );
};

export const SongCard = ({ data, index }) => {
  const [isDeleted, setIsDeleted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const [{ song, isSongPlaying }, dispatch] = useStateValue();

  const addSongToContext = () => {
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

  const deleteObject = (id) => {
    deleteSongById(id)
      .then((res) => {
        if (res.data.success) {
          setAlert("успішно");
          setAlertMsg(res.data.msg);
          getAllSongsInAsc()
            .then((data) => {
              dispatch({
                type: actionType.SET_ALL_SONGS,
                allSongs: data.data,
              });
            })
            .catch((error) => {
              console.error(error);
            });
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        } else {
          setAlert("помилка");
          setAlertMsg(res.data.msg);
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const navigate = useNavigate();
  const navigateToEditAlbum = () => {
    navigate(`/dashboard/editSong/${data?._id}`);
  };

  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-40 min-w-210 px-2 pt-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-50 shadow-md rounded-lg flex flex-col items-center"
      onClick={addSongToContext}
    >
      {isDeleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          className="absolute z-10 p-2 inset-0 bg-card backdrop-blur-md flex flex-col gap-6 items-center justify-center"
        >
          <p className="text-sm text-center text-textColor font-semibold">
            Ти бажаєш видалити цю пісню?
          </p>

          <div className="flex items-center gap-3">
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-teal-400"
              onClick={() => {
                deleteObject(data?._id);
                setIsDeleted(false);
              }}
            >
              Так
            </button>
            <button
              className="text-sm px-4 py-1 rounded-md text-white hover:shadow-md bg-gray-400"
              onClick={() => setIsDeleted(false)}
            >
              Ні
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

      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden mt-3">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data?.imageURL}
          alt=""
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="text-base text-headingColor font-semibold my-2 text-center">
        {data?.name.length > 25 ? `${data?.name.slice(0, 25)}` : data?.name}
        <span className="block text-sm text-gray-400 my-1">{data?.artist}</span>
      </p>

      <div className="flex mb-4">
        <div>Редагувати</div>
        <MdModeEdit onClick={navigateToEditAlbum} className="ml-3" size={20} />
      </div>

      {alert && (
        <>
          {alert == "успішно" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardSongs;
