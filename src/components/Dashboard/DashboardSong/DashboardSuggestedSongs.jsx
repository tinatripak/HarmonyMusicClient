import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GrClearOption } from "react-icons/gr";
import {
  deleteSuggestedSongById,
  getAllAlbums,
  getAllArtist,
  getAllSongsInAsc,
  getSuggestedSongs,
  saveNewAlbum,
  saveNewSinger,
  saveNewSong,
} from "../../../api";
import { useStateValue } from "../../../Context/StateProvider";
import { actionType } from "../../../Context/reducer";
import { ImCross } from "react-icons/im";
import { BiCheckCircle } from "react-icons/bi";

import AlertSuccess from "../../Alerts/AlertSuccess";
import AlertError from "../../Alerts/AlertError";

const DashboardSuggestedSongs = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState(null);

  const [{ allSuggestedSongs }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allSuggestedSongs) {
      getSuggestedSongs()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_SUGGESTED_SONGS,
            allSuggestedSongs: data.data,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  useEffect(() => {
    if (songFilter.length > 0) {
      const filtered = allSuggestedSongs.filter(
        (data) =>
          data?.singerName.toLowerCase().includes(songFilter) ||
          data?.songLanguage.toLowerCase().includes(songFilter) ||
          data?.songName.toLowerCase().includes(songFilter)
      );
      setFilteredSongs(filtered);
    } else {
      setFilteredSongs(null);
    }
  }, [songFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
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
            {allSuggestedSongs?.length}
          </p>
        </div>

        <SongContainer
          data={filteredSongs ? filteredSongs : allSuggestedSongs}
        />
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
        type: actionType.SET_SUGGESTED_SONG,
        suggestedSong: index,
      });
    }
  };

  const deleteObject = (id) => {
    deleteSuggestedSongById(id)
      .then((res) => {
        if (res.data.success) {
          setAlert("успішно");
          setAlertMsg(res.data.msg);
          getSuggestedSongs()
            .then((data) => {
              dispatch({
                type: actionType.SET_ALL_SUGGESTED_SONGS,
                allSuggestedSongs: data.data,
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
  const approveSuggestedSong = () => {
    const albumData = {
      name: data?.albumName,
      imageURL: data?.albumImage,
      artist: data?.singerName,
    };
    saveNewAlbum(albumData)
      .then((res) => {
        getAllAlbums()
          .then((allAlbums) => {
            dispatch({
              type: actionType.SET_ALL_ALBUMNS,
              allAlbums: allAlbums.data,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    const singerData = {
      name: data?.singerName,
      imageURL: data?.singerImage,
      twitter: data?.singerTwitter,
      instagram: data?.singerInstagram,
    };
    saveNewSinger(singerData)
      .then((res) => {
        getAllArtist()
          .then((artistData) => {
            dispatch({
              type: actionType.SET_ARTISTS,
              artists: artistData.data,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    const songData = {
      name: data?.songName,
      imageURL: data?.songImage,
      songUrl: data?.songAudio,
      album: data?.albumName,
      artist: data?.singerName,
      language: data?.songLanguage,
      category: data?.songCategory,
      year: data?.songYear,
    };

    saveNewSong(songData)
      .then((res) => {
        getAllSongsInAsc()
          .then((songs) => {
            dispatch({ type: actionType.SET_ALL_SONGS, allSongs: songs.data });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    if (albumData && singerData && songData) {
      deleteSuggestedSongById(data?._id)
        .then((res) => {
          if (res.data.success) {
            setAlert("успішно");
            setAlertMsg(res.data.msg);
            getSuggestedSongs()
              .then((data) => {
                dispatch({
                  type: actionType.SET_ALL_SUGGESTED_SONGS,
                  allSuggestedSongs: data.data,
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
    }
  };

  return (
    <motion.div
      // whileTap={{ scale: 0.8 }}
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
          // whileTap={{ scale: 0.5 }}
          className="absolute right-0 -top-1 w-8 h-8 rounded-md flex items-center justify-center"
          onClick={() => setIsDeleted(true)}
        >
          <ImCross
            className="text-xl text-red-600 hover:text-red-700"
            size={17}
          />
        </motion.div>
      )}

      <motion.div
        // whileTap={{ scale: 0.5 }}
        className="absolute right-6 -top-1 w-8 h-8 rounded-md flex items-center justify-center"
      >
        <BiCheckCircle
          className="text-xl text-green-600 hover:text-green-700 font-semibold"
          size={24}
          onClick={approveSuggestedSong}
        />
      </motion.div>

      <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden mt-3">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data?.songImage}
          alt=""
          className=" w-full h-full rounded-lg object-cover"
        />
      </div>

      <p className="text-base text-headingColor font-semibold mt-2 text-center">
        {data?.songName}
        <span className="block text-sm text-gray-400 my-1">
          Виконавець: {data?.singerName}
        </span>
      </p>
      <p className="text-base my-1 text-headingColor font-semibold ">
         Відправник: {data?.userName}
      </p>

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

export default DashboardSuggestedSongs;
