import React, { useRef, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";

import { MdDelete } from "react-icons/md";

import { storage } from "../../config/firebase.config";
import { useStateValue } from "../../Context/StateProvider";
import FilterButtons from "../Filter/FilterButtons";
import { getSuggestedSongs, saveNewSuggestedSong } from "../../api";
import { actionType } from "../../Context/reducer";
import { filterByLanguage, filterByGenre } from "../../utils/supportfunctions";
import AlertSuccess from "../../components/Alerts/AlertSuccess";
import AlertError from "../../components/Alerts/AlertError";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "../Dashboard/newSongStyle.css";

import ImageAudioLoader from "../Additional/ImageAudioLoader";
import ImageAudioUploader from "../Additional/ImageAudioUploader";
import DisabledButton from "../Additional/DisabledButton";

const SuggestASong = () => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [songImageUrl, setSongImageUrl] = useState(null);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [songName, setSongName] = useState("");
  const [audioAsset, setAudioAsset] = useState(null);
  const [, setDuration] = useState(null);
  const audioRef = useRef();
  const [categoryFlag, setCategoryFlag] = useState("Жанр");
  const [languageFlag, setLanguageFlag] = useState("Мова");
  const [yearFlag, setYearFlag] = useState("Рік");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [albumName, setAlbumName] = useState("");
  const [singerName, setSingerName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isAlbum, setIsAlbum] = useState(false);
  const [albumCoverImage, setAlbumCoverImage] = useState(null);
  const [isSinger, setIsSinger] = useState(false);
  const [singerCoverImage, setSingerCoverImage] = useState(null);

  const [{ filterTerm, languageFilter, yearFilter }, dispatch] =
    useStateValue();

  const deleteImageObject = (songURL, action) => {
    if (action === "image") {
      setIsImageLoading(true);
      setSongImageUrl(null);
    } else {
      setIsAudioLoading(true);
      setAudioAsset(null);
    }
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef)
      .then(() => {
        setAlert("success");
        setAlertMsg("File removed successfully");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        setIsImageLoading(false);
        setIsAudioLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const deletePhotoAlbum = (songURL, action) => {
    if (action === "image") {
      setIsAlbum(true);
    }
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef)
      .then(() => {
        setAlert("success");
        setAlertMsg("File removed successfully");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        setIsAlbum(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const deletePhotoSinger = (songURL, action) => {
    if (action === "image") {
      setIsSinger(true);
    }
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef)
      .then(() => {
        setAlert("success");
        setAlertMsg("File removed successfully");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        setIsSinger(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveSuggestedSong = () => {
    if (
      !userName ||
      !email ||
      !songName ||
      !filterTerm ||
      !languageFilter ||
      !yearFilter ||
      !songImageUrl ||
      !audioAsset ||
      !albumName ||
      !albumCoverImage ||
      !singerName ||
      !singerCoverImage
    ) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsImageLoading(true);
      setIsAudioLoading(true);
      setIsAlbum(true);
      setIsSinger(true);
      const data = {
        userName: userName,
        email: email,
        songName: songName,
        songImage: songImageUrl,
        songAudio: audioAsset,
        songLanguage: languageFilter,
        songCategory: filterTerm,
        songYear: yearFilter,
        singerName: singerName,
        singerImage: singerCoverImage,
        singerTwitter: twitter,
        singerInstagram: instagram,
        albumName: albumName,
        albumImage: albumCoverImage,
      };
      saveNewSuggestedSong(data)
        .then((res) => {
          getSuggestedSongs()
            .then((allSuggestedSongs) => {
              dispatch({
                type: actionType.SET_ALL_SUGGESTED_SONGS,
                allSuggestedSongs: allSuggestedSongs.data,
              });
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          console.error(error);
        });
      setAlert("success");
      setAlertMsg("Data saved successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsImageLoading(false);
      setIsAudioLoading(false);
      setIsAlbum(false);
      setIsSinger(false);
      setSongImageUrl(null);
      setAudioAsset(null);
      setAlbumCoverImage(null);
      setSingerCoverImage(null);
      setUserName("");
      setEmail("");
      setSongName("");
      setAlbumName("");
      setSingerName("");
      setTwitter("");
      setInstagram("");
      setYear("Рік");
      setCategory("Жанр");
      setLanguage("Мова");
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
      dispatch({ type: actionType.SET_YEAR_FILTER, yearFilter: null });
      setDuration(null);
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

  const setYear = (name) => {
    setYearFlag(name);
    if (name === "Рік") {
      dispatch({ type: actionType.SET_YEAR_FILTER, yearFilter: null });
    } else {
      dispatch({ type: actionType.SET_YEAR_FILTER, yearFilter: name });
    }
  };
  const getDropList = () => {
    const year = new Date().getFullYear();
    const dropList = [];

    for (let i = 0; i < 120; i++) {
      const obj = {
        id: i + 1,
        name: String(year - i),
        value: year - i,
      };

      dropList.push(obj);
    }

    return dropList;
  };
  const filterByYear = getDropList();

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="text-2xl text-center mt-10">Запропонувати пісню</div>
      <div>
        <div className="text-xl mb-10 mt-8">
          Якщо ти хочеш, щоб ми додали на сайт вашу авторську пісню, заповніть
          наступні поля:
        </div>
        <div className="grid grid-cols-2 mb-8 gap-44">
          <div>
            <label>Ваше ім'я</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-transparent border-b-2 border-black px-2"
            />
          </div>
          <div>
            <label>Ваш емейл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b-2 border-black px-2"
            />
          </div>
        </div>
        <div>
          <div>
            <div>
              <div className="font-semibold my-8 text-center">
                Подробиці про пісню
              </div>
              <div className="grid grid-cols-3 mb-8">
                <div className="col-span-2 mt-auto">
                  <label>Назва пісні</label>
                  <input
                    type="text"
                    placeholder=""
                    className="bg-transparent border-b-2 border-black song-input px-2"
                    value={songName}
                    onChange={(e) => setSongName(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mb-7">
              <div className="grid grid-cols-2 gap-10 mb-7">
                <div>
                  <label>Виберіть жанр:</label>
                  <FilterButtons
                    filterData={filterByGenre}
                    flag={categoryFlag}
                    setFilter={setCategory}
                  />
                </div>
                <div>
                  <label>Виберіть мову:</label>
                  <FilterButtons
                    filterData={filterByLanguage}
                    flag={languageFlag}
                    setFilter={setLanguage}
                  />
                </div>
              </div>
              <label>Виберіть рік:</label>
              <FilterButtons
                filterData={filterByYear}
                flag={yearFlag}
                setFilter={setYear}
              />
            </div>

            <div className="grid grid-cols-2 gap-10 w-full flex-wrap">
              <div>
                <label>Фотографія пісні</label>
                <div className="card-center bg-card  backdrop-blur-md w-full lg:w-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {/* <p className=" absolute text-xl mx-auto text-center text-gray-black pt-14 pl-20">
                  upload image
                </p> */}
                {isImageLoading && (
                    <ImageAudioLoader progress={uploadProgress} />
                  )}
                  {!isImageLoading && (
                    <>
                      {!songImageUrl ? (
                        <ImageAudioUploader
                          setImageURL={setSongImageUrl}
                          setAlert={setAlert}
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
              </div>
              <div>
                <label>Аудіозапис пісні</label>
                <div className="card-center bg-card  backdrop-blur-md w-full lg:w-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {/* <p className=" absolute text-xl mx-auto text-center text-gray-black pt-14 pl-20">
                  upload song
                </p> */}
                  {isAudioLoading && (
                    <ImageAudioLoader progress={uploadProgress} />
                  )}
                  {!isAudioLoading && (
                    <>
                      {!audioAsset ? (
                        <ImageAudioUploader
                          setImageURL={setAudioAsset}
                          setAlert={setAlert}
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
                            className="absolute bottom-1 right-0 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
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
              <div></div>
            </div>
            <div>
              <div className="font-semibold text-center mb-8">
                Подробиці про альбом
              </div>
              <label>Назва альбому</label>
              <input
                type="text"
                placeholder=""
                className="bg-transparent border-b-2 border-black song-input px-2"
                value={albumName}
                onChange={(e) => setAlbumName(e.target.value)}
              />
              <div className="mt-8">
                <label>Фотографія альбому</label>
                <div className="bg-card  backdrop-blur-md w-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {/* <p className=" absolute text-xl mx-auto text-center text-gray-black pt-14 pl-20">
                  upload image
                </p> */}
                {isAlbum && <ImageAudioLoader progress={uploadProgress} />}
                  {!isAlbum && (
                    <>
                      {!albumCoverImage ? (
                        <ImageAudioUploader
                          setImageURL={setAlbumCoverImage}
                          setAlert={setAlert}
                          alertMsg={setAlertMsg}
                          isLoading={setIsAlbum}
                          setProgress={setUploadProgress}
                          isImage={true}
                        />
                      ) : (
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                          <img
                            src={albumCoverImage}
                            alt="uploaded image"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                            onClick={() => {
                              deletePhotoAlbum(albumCoverImage, "image");
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
            </div>

            <div>
              <div className="font-semibold text-center mb-8">
                Подробиці про виконавця
              </div>
              <label>Ім'я виконавця</label>
              <input
                type="text"
                placeholder=""
                className="bg-transparent border-b-2 border-black song-input px-2"
                value={singerName}
                onChange={(e) => setSingerName(e.target.value)}
              />
              <div className="mt-8">
                <label>Фотографія виконавця</label>
                <div className="bg-card  backdrop-blur-md w-300 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {/* <p className=" absolute text-xl mx-auto text-center text-gray-black pt-14 pl-20">
                  upload image
                </p> */}
                {isSinger && <ImageAudioLoader progress={uploadProgress} />}
                  {!isSinger && (
                    <>
                      {!singerCoverImage ? (
                        <ImageAudioUploader
                          setImageURL={setSingerCoverImage}
                          setAlert={setAlert}
                          alertMsg={setAlertMsg}
                          isLoading={setIsSinger}
                          setProgress={setUploadProgress}
                          isImage={true}
                        />
                      ) : (
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                          <img
                            src={singerCoverImage}
                            alt="uploaded image"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                            onClick={() => {
                              deletePhotoSinger(singerCoverImage, "image");
                            }}
                          >
                            <MdDelete className="text-white" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="my-8">
                  <label>Twitter сторінка</label>
                  <input
                    type="text"
                    placeholder=""
                    className="bg-transparent border-b-2 border-black song-input px-2"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                  />
                </div>
                <div className="my-8">
                  <label>Instagram сторінка</label>
                  <input
                    type="text"
                    placeholder=""
                    className="bg-transparent border-b-2 border-black song-input px-2"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full p-4 mb-8">
              {isImageLoading || isAudioLoading ? (
                <DisabledButton />
              ) : (
                <motion.button
                  whileTap={{ scale: 0.75 }}
                  className="px-8 py-2 rounded-full text-black font-semibold bg-white border border-black hover:shadow-lg"
                  onClick={() => {saveSuggestedSong()}}
                >
                  Відправити
                </motion.button>
              )}
            </div>
          </div>
          {alert && (
            <>
              {alert == "success" ? (
                <AlertSuccess msg={alertMsg} />
              ) : (
                <AlertError msg={alertMsg} />
              )}
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuggestASong;
