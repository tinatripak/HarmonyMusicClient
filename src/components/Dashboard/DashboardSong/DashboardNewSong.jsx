import React, { useEffect, useRef, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";

import { MdDelete } from "react-icons/md";

import { storage } from "../../../config/firebase.config";
import { useStateValue } from "../../../Context/StateProvider";
import FilterButtons from "../../Filter/FilterButtons";
import {
  getAlbumsBySinger,
  getAllArtist,
  getAllSongsInAsc,
  saveNewSong,
} from "../../../api";
import { actionType } from "../../../Context/reducer";
import {
  filterByLanguage,
  filterByGenre,
} from "../../../utils/supportfunctions";
import AlertSuccess from "../../Alerts/AlertSuccess";
import AlertError from "../../Alerts/AlertError";
import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";
import "../newSongStyle.css";

const DashboardNewSong = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageUrl, setSongImageUrl] = useState(null);
  const [setAlert, setSetAlert] = useState(null);
  const [alertMsg, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [songName, setSongName] = useState("");
  const [year, setYear] = useState("");

  const [audioAsset, setAudioAsset] = useState(null);
  const audioRef = useRef();
  const [artistFlag, setArtistFlag] = useState("Виконавець");
  const [categoryFlag, setCategoryFlag] = useState("Жанр");
  const [albumFlag, setAlbumFlag] = useState("Альбом");
  const [languageFlag, setLanguageFlag] = useState("Мова");
  const [albumsOfSinger, setAlbumsOfSinger] = useState("");

  const [
    {
      artists,
      allAlbums,
      albumFilter,
      artistFilter,
      filterTerm,
      languageFilter,
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }

    if (!allAlbums) {
      getAlbumsBySinger(artistFilter).then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [artists, allAlbums, dispatch]);

  useEffect(() => {
    if (artistFilter !== null) {
      getAlbumsBySinger(artistFilter).then((response) => {
        console.log("qw", response.data);
        setAlbumsOfSinger(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [artistFilter]);

  const deleteImageObject = (songURL, action) => {
    if (action === "image") {
      setIsImageLoading(true);
      setSongImageUrl(null);
    } else {
      setIsAudioLoading(true);
      setAudioAsset(null);
    }
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setSetAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
    }).catch((error) => {
      console.error(error);
    });
  };

  const saveSong = () => {
    if (!songImageUrl || !audioAsset || !songName) {
      setSetAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
    } else {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      const data = {
        name: songName,
        imageURL: songImageUrl,
        songUrl: audioAsset,
        album: albumFilter,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
        year: year,
      };

      saveNewSong(data).then((res) => {
        getAllSongsInAsc().then((songs) => {
          dispatch({ type: actionType.SET_ALL_SONGS, allSongs: songs.data });
        }).catch((error) => {
          console.error(error);
        });
      }).catch((error) => {
        console.error(error);
      });
      setSetAlert("success");
      setAlertMsg("Data saved successfully");
      setTimeout(() => {
        setSetAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
      setSongName("");
      setYear("");
      setSongImageUrl(null);
      setAudioAsset(null);

      setArtistFlag("Виконавець");
      setCategoryFlag("Жанр");
      setAlbumFlag("Альбом");
      setLanguageFlag("Мова");
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    }
  };

  const setArtist = (name) => {
    setArtistFlag(name);
    if (name === "Виконавець") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    } else {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    }
    setAlbum("Альбом");
  };

  const setAlbum = (name) => {
    setAlbumFlag(name);
    if (name === "Альбом") {
      console.log("qwer", name);
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
    } else {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: name });
    }
  };

  const setCategory = (name) => {
    setCategoryFlag(name);
    if (name === "Жанр") {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    } else {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: name });
    }
  };

  const setLanguage = (name) => {
    setLanguageFlag(name);
    if (name === "Мова") {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
    } else {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: name });
    }
  };

  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
      <div className="w-1/2 mx-auto">
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="text"
            placeholder="Type your song name"
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
          />

          <div className="flex w-full justify-between flex-wrap items-center gap-4">
            <FilterButtons
              filterData={artists}
              flag={artistFlag}
              setFilter={setArtist}
            />
            {artistFilter !== null && albumsOfSinger.length > 0 && (
              <FilterButtons
                filterData={albumsOfSinger}
                flag={albumFlag}
                setFilter={setAlbum}
              />
            )}
            <FilterButtons
              filterData={filterByGenre}
              flag={categoryFlag}
              setFilter={setCategory}
            />
            <FilterButtons
              filterData={filterByLanguage}
              flag={languageFlag}
              setFilter={setLanguage}
            />
          </div>
          <input
            type="number"
            placeholder="Year"
            className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />

          <div className="flex items-center justify-between gap-2 w-full flex-wrap">
            <div className="card-center bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isImageLoading && <ImageAudioLoader progress={uploadProgress} />}
              {!isImageLoading && (
                <>
                  {!songImageUrl ? (
                    <ImageAudioUploader
                      setImageURL={setSongImageUrl}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsImageLoading}
                      setProgress={setUploadProgress}
                      isImage={true}
                    />
                  ) : (
                    <div className="relative w-full h-full overflow-hidden rounded-md">
                      <img
                        src={songImageUrl}
                        alt="uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(songImageUrl, "image");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="card-center bg-card  backdrop-blur-md w-full lg:w-300 h-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
              {isAudioLoading && <ImageAudioLoader progress={uploadProgress} />}
              {!isAudioLoading && (
                <>
                  {!audioAsset ? (
                    <ImageAudioUploader
                      setImageURL={setAudioAsset}
                      setAlert={setSetAlert}
                      alertMsg={setAlertMsg}
                      isLoading={setIsAudioLoading}
                      setProgress={setUploadProgress}
                      isImage={false}
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                      <audio ref={audioRef} src={audioAsset} controls />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={() => {
                          deleteImageObject(audioAsset, "audio");
                        }}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center justify-end w-full p-4">
              {isImageLoading || isAudioLoading ? (
                <DisabledButton />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                  onClick={saveSong}
                >
                  Send
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
      {setAlert && (
        <>
          {setAlert === "success" ? (
            <AlertSuccess msg={alertMsg} />
          ) : (
            <AlertError msg={alertMsg} />
          )}
        </>
      )}
    </div>
  );
};

export default DashboardNewSong;
