import React, { useEffect, useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";

import { MdDelete } from "react-icons/md";

import { storage } from "../../../config/firebase.config";
import { useStateValue } from "../../../Context/StateProvider";
import FilterButtons from "../../Filter/FilterButtons";
import { getAllAlbums, getAllArtist, saveNewAlbum } from "../../../api";
import { actionType } from "../../../Context/reducer";
import AlertSuccess from "../../Alerts/AlertSuccess";
import AlertError from "../../Alerts/AlertError";
import "../newSongStyle.css";
import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";

const AddNewAlbum = () => {
  const [isAlbum, setIsAlbum] = useState(false);
  const [albumProgress, setAlbumProgress] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [albumCoverImage, setAlbumCoverImage] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [artistFlag, setArtistFlag] = useState("Виконавець");

  const [{ artists, artistFilter }, dispatch] = useStateValue();

  useEffect(() => {
    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }
  }, []);

  const deleteImageObject = (songURL) => {
    setIsAlbum(true);
    setAlbumCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsAlbum(false);
    }).catch((error) => {
      console.error(error);
    });
  };

  const saveAlbum = () => {
    if (!albumCoverImage || !albumName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsAlbum(true);
      const data = {
        name: albumName,
        imageURL: albumCoverImage,
        artist: artistFilter,
      };
      saveNewAlbum(data).then((res) => {
        getAllAlbums().then((allAlbums) => {
          dispatch({
            type: actionType.SET_ALL_ALBUMNS,
            allAlbums: allAlbums.data,
          });
        }).catch((error) => {
          console.error(error);
        });
      }).catch((error) => {
        console.error(error);
      });
      setIsAlbum(false);
      setAlbumCoverImage(null);
      setAlbumName("");
      setArtistFlag("Виконавець");
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    }
  };
  const setArtist = (name) => {
    setArtistFlag(name);
    if (name === "Виконавець") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    } else {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isAlbum && <ImageAudioLoader progress={albumProgress} />}
        {!isAlbum && (
          <>
            {!albumCoverImage ? (
              <ImageAudioUploader
                setImageURL={setAlbumCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsAlbum}
                setProgress={setAlbumProgress}
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
                    deleteImageObject(albumCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col gap-4 ">
        <input
          type="text"
          placeholder="Album Name"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={albumName}
          onChange={(e) => setAlbumName(e.target.value)}
        />

        <div className="w-1/2">
          {/* <FilterButtons filterData={artists} flag={"Виконавець"}/> */}
          <FilterButtons
            filterData={artists}
            flag={artistFlag}
            setFilter={setArtist}
          />
        </div>

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isAlbum ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveAlbum}
            >
              Send
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
  );
};

const DashboardNewAlbum = () => {
  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <AddNewAlbum />
      </div>
    </div>
  );
};

export default DashboardNewAlbum;
