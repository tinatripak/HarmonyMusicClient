import React, { useEffect, useState } from "react";
import {
  deleteOneFromFavourites,
  getAllSongsInAsc,
  getFavourites,
  getSongsByIds,
  saveNewFavoriteSong,
} from "../../api";
import { actionType } from "../../Context/reducer";
import { useStateValue } from "../../Context/StateProvider";
import "../Music/musicStyle.css";

import Filter from "../Filter/Filter";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { MdFavorite } from "react-icons/md";

import SearchBar from "../SearchBar/SearchBar";
import { motion } from "framer-motion";
import MusicPlayer from "./MusicPlayer";
import MusicNotFound from "./MusicNotFound";
import { BsDot } from "react-icons/bs";
import "./music.css";
import {IoMdDownload} from 'react-icons/io'

const Music = () => {
  const [
    {
      searchTerm,
      isSongPlaying,
      allSongs,
      artistFilter,
      filterTerm,
      albumFilter,
      languageFilter,
      yearFilter,
    },
    dispatch,
  ] = useStateValue();

  const [filteredSongs, setFilteredSongs] = useState(null);

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

  useEffect(() => {
    let filtered = allSongs;

    if (searchTerm.length > 0) {
      filtered = filtered?.filter((data) =>
        data?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (artistFilter !== null) {
      filtered = filtered?.filter(
        (data) => data?.artist.toLowerCase() === artistFilter.toLowerCase()
      );
    }

    if (albumFilter !== null) {
      filtered = filtered?.filter(
        (data) => data?.album.toLowerCase() === albumFilter.toLowerCase()
      );
    }

    if (filterTerm !== null && filterTerm !== "all") {
      filtered = filtered?.filter(
        (data) => data?.category.toLowerCase() === filterTerm.toLowerCase()
      );
    }

    if (languageFilter !== null) {
      filtered = filtered?.filter(
        (data) => data?.language.toLowerCase() === languageFilter.toLowerCase()
      );
    }

    if (yearFilter !== null) {
      filtered = filtered?.filter(
        (data) => data?.year.toLowerCase() === yearFilter.toLowerCase()
      );
    }

    setFilteredSongs(filtered);
  }, [
    searchTerm,
    artistFilter,
    albumFilter,
    filterTerm,
    languageFilter,
    yearFilter,
  ]);

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="flex items-center justify-center">
          <SearchBar />
          <Filter />
      </div>
      <div className="min-h-500">
      {
        allSongs &&
        languageFilter == null &&
        artistFilter == null &&
        albumFilter == null &&
        yearFilter == null &&
        (filterTerm == "all" || filterTerm == null) &&
        searchTerm.length === 0 &&
        <div className="h-auto grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 auto-cols-min gap-4 p-4 mb-10 transition-all song-container"
        >
         <MusicSongContainer musics={allSongs} />
        </div>
      }

      {(languageFilter ||
        artistFilter ||
        albumFilter ||
        filterTerm ||
        yearFilter ||
        searchTerm.length > 0) &&
        filteredSongs?.length > 0 && (
        <div className="h-auto grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2 auto-cols-min gap-4 p-4  mb-10 transition-all">
          <MusicSongContainer musics={filteredSongs} /> 
        </div>
        )}
    
      {(languageFilter ||
        artistFilter ||
        albumFilter ||
        filterTerm ||
        yearFilter ||
        searchTerm.length > 0) &&
        filteredSongs?.length === 0 &&
        <div className="my-52">
          <MusicNotFound />

        </div>
      }
      </div>

      {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed min-w-[700px] h-26 inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md `}
        >
          <MusicPlayer musics={filteredSongs ? filteredSongs : allSongs} />
        </motion.div>
      )}
      <Footer />
    </div>
  );
};

export const MusicSongContainer = ({ musics }) => {
  const [{ isSongPlaying, song, user }, dispatch] = useStateValue();
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
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await getFavourites(user?.user._id);
    const songsData = await getSongsByIds(response?.data);
    setList(songsData?.data);
  };

  const addSongToFavorite = (data) => {
    saveNewFavoriteSong(user?.user._id, { songId: data?._id })
      .then(() => {
        (async () => {
          try {
            await fetchList();
          } catch (error) {
            console.error(error);
          }
        })();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteSongFromFavorite = (data) => {
    if (data?._id) {
      deleteOneFromFavourites(user?.user._id, { songId: data?._id })
        .then(() => {
          (async () => {
            try {
              await fetchList();
            } catch (error) {
              console.error(error);
            }
          })();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchList();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <>
      {musics?.map((data, index) => {
        return(
        <div
          className="hover:scale-105 relative px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-white bg-card shadow-md rounded-lg"
          key={data?._id}
          id={data?._id}
          
        >
          <motion.div
            key={data._id}
            whileTap={{ scale: 0.8 }}
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => addSongToContext(index)}
          >
            <div className=" w-52 h-52  rounded-lg drop-shadow-lg relative overflow-hidden px-2">
              <motion.img
                src={data?.imageURL}
                alt="Songs?"
                className=" w-full h-full rounded-lg object-cover"
              />
            </div>
            <div className="px-2 w-fit">
              <p className="text-base text-headingColor font-black my-2 text-left hyphens-auto flex">
              {data?.name}
              </p>
              <div className="text-sm text-gray-500 my-1 flex hyphens-auto items-center">
                <p>{data?.year}</p>
                <BsDot />
                <a
                  href={"/albumsAndSonsBySinger/" + data?.artist}
                  className="hover:underline"
                >
                  {data?.artist}
                </a>
              </div>
            </div>
          </motion.div>
          <div className="flex justify-center gap-10 items-center">
          <a
            href={data?.songUrl}
            download={data?.name}
            target="_blank"
            rel="noreferrer"
            className="hover:scale-110"
          >
            <IoMdDownload/>
          </a>
          <motion.div key={`${data?._id}_`} whileHover={{ scale: 1.2 }}>
            {list?.some((item) => item._id === data?._id) ? (
              <MdFavorite
                className="mx-auto text-blue-600"
                title="улюблена пісня"
                onClick={() => deleteSongFromFavorite(data)}
              />
            ) : (
              <MdFavorite
                className="mx-auto text-gray-500 hover:text-red-600"
                onClick={() => addSongToFavorite(data)}
              />
            )}
          </motion.div>
          </div>
        </div>
      )}
      )}
    </>
  );
  
};

export default Music;
