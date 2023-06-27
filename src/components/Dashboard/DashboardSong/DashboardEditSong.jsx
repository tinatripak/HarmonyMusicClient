import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAlbumsBySinger,
  getAllArtist,
  getAllSongsInAsc,
  getSongById,
  updateSongById,
} from "../../../api";
import { deleteObject, ref } from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { storage } from "../../../config/firebase.config";
import { actionType } from "../../../Context/reducer";
import { useStateValue } from "../../../Context/StateProvider";
import FilterButtons from "../../Filter/FilterButtons";
import {
  filterByLanguage,
  filterByGenre,
} from "../../../utils/supportfunctions";
import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";

const DashboardEditSong = () => {
  const { _id } = useParams();
  const [song, setSong] = useState();

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageUrl, setSongImageUrl] = useState(null);
  const [, setSetAlert] = useState(null);
  const [, setAlertMsg] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const [songName, setSongName] = useState("");
  const [year, setYear] = useState("");

  const [audioAsset, setAudioAsset] = useState(null);
  const [, setDuration] = useState(null);
  const audioRef = useRef();
  const [artistFlag, setArtistFlag] = useState("Виконавець");
  const [categoryFlag, setCategoryFlag] = useState("Жанр");
  const [albumFlag, setAlbumFlag] = useState("Альбом");
  const [languageFlag, setLanguageFlag] = useState("Мова");
  const [albumsOfSinger, setAlbumsOfSinger] = useState("");

  const [
    {
      artists,
      artistFilter,
      allAlbums,
      albumFilter,
      languageFilter,
      filterTerm,
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    async function fetchSong() {
      const response = await getSongById(_id);
      setSong(response.data);
    }
    (async () => {
      try {
        await fetchSong();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [_id]);

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

  const updateSong = () => {
    setIsImageLoading(true);
    setIsAudioLoading(true);
    const songArr = {
      name: songName !== "" ? songName : song?.name,
      imageURL: songImageUrl ? songImageUrl : song?.imageURL,
      songUrl: audioAsset ? audioAsset : song?.songUrl,
      album: albumFilter ? albumFilter : song?.album,
      artist: artistFilter ? artistFilter : song?.artist,
      language: languageFilter ? languageFilter : song?.language,
      category: filterTerm ? filterTerm : song?.category,
      year: year !== "" ? year : song?.year,
    };
    updateSongById(song?._id, songArr).then((res) => {
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
    dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
    dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
    dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    setDuration(null);
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
  const currYear = new Date().getFullYear();

  return (
    <div>
      <div className="text-2xl text-center mb-10 ">
        Редагування "{song?.name}"
      </div>
      <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
        <div className="w-1/2 mx-auto">
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              type="text"
              placeholder={song?.name}
              className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-card"
              value={songName}
              onChange={(e) => setSongName(e.target.value)}
            />
            <div className="flex w-full justify-between flex-wrap items-center gap-4">
              <div>
                Оберіть нового виконавця або залиште{" "}
                <span className="font-semibold">{song?.artist}</span>
              </div>
              <FilterButtons
                filterData={artists}
                flag={artistFlag}
                setFilter={setArtist}
              />

              {artistFilter !== null && albumsOfSinger.length > 0 && (
                <>
                  <div>
                    Оберіть новий альбом або залиште{" "}
                    <span className="font-semibold">{song?.album}</span>
                  </div>
                  <FilterButtons
                    filterData={albumsOfSinger}
                    flag={albumFlag}
                    setFilter={setAlbum}
                  />
                </>
              )}
              <div>
                Оберіть нову категорію або залиште{" "}
                <span className="font-semibold">{song?.category}</span>
              </div>
              <FilterButtons
                filterData={filterByGenre}
                flag={categoryFlag}
                setFilter={setCategory}
              />
              <div>
                Оберіть нову мову або залиште{" "}
                <span className="font-semibold">{song?.language}</span>
              </div>
              <FilterButtons
                filterData={filterByLanguage}
                flag={languageFlag}
                setFilter={setLanguage}
              />
            </div>
            <input
              type="number"
              placeholder={song?.year}
              className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-card"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max={currYear}
            />
            <div className="flex items-center justify-between gap-2 w-full flex-wrap">
              <div className="relative">
                <img
                  src={song?.imageURL}
                  alt="cover"
                  className="object-cover	w-225 h-225 "
                />
                {song?.imageURL && (
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    <div className="w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer ">
                      {isImageLoading && (
                        <ImageAudioLoader progress={uploadProgress} />
                      )}
                      {!isImageLoading && (
                        <div className="text-white">
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
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div>
                {song?.songUrl && <audio src={song?.songUrl} controls />}
                <div className="card-center bg-card  backdrop-blur-md w-full lg:w-300 h-96 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                  {isAudioLoading && (
                    <ImageAudioLoader progress={uploadProgress} />
                  )}
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
              </div>

              <div className="flex items-center justify-end w-full p-4">
                {isImageLoading || isAudioLoading ? (
                  <DisabledButton />
                ) : (
                  <motion.button
                    whileTap={{ scale: 0.75 }}
                    className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
                    onClick={updateSong}
                  >
                    Зберегти
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEditSong;
