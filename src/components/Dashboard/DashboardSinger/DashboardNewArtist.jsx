import React, { useState } from "react";
import { ref, deleteObject } from "firebase/storage";
import { motion } from "framer-motion";

import { MdDelete } from "react-icons/md";

import { storage } from "../../../config/firebase.config";
import { useStateValue } from "../../../Context/StateProvider";
import { getAllArtist, saveNewSinger } from "../../../api";
import { actionType } from "../../../Context/reducer";
import AlertSuccess from "../../Alerts/AlertSuccess";
import AlertError from "../../Alerts/AlertError";
import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";
import "../newSongStyle.css";

const DashboardNewArtist = () => {
  const [setAlert, ] = useState(null);
  const [alertMsg, ] = useState("");

  return (
    <div className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
      <div className="flex flex-col items-center justify-center w-full p-4">
        <AddNewArtist />
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

export default DashboardNewArtist;

const AddNewArtist = () => {
  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);

  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [artistCoverImage, setArtistCoverImage] = useState(null);

  const [singerName, setsingerName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  const [dispatch] = useStateValue();

  const deleteImageObject = (songURL) => {
    setIsArtist(true);
    setArtistCoverImage(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef).then(() => {
      setAlert("success");
      setAlertMsg("File removed successfully");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      setIsArtist(false);
    }).catch((error) => {
      console.error(error);
    });
  };

  const saveArtist = () => {
    if (!artistCoverImage || !singerName) {
      setAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
    } else {
      setIsArtist(true);
      const data = {
        name: singerName,
        imageURL: artistCoverImage,
        twitter: twitter,
        instagram: instagram,
      };
      saveNewSinger(data).then((res) => {
        getAllArtist().then((artistData) => {
          dispatch({ type: actionType.SET_ARTISTS, artists: artistData.data });
        }).catch((error) => {
          console.error(error);
        });
      }).catch((error) => {
        console.error(error);
      });
      setIsArtist(false);
      setArtistCoverImage(null);
      setsingerName("");
      setTwitter("");
      setInstagram("");
    }
  };

  return (
    <div className="flex items-center justify-evenly w-full flex-wrap">
      <div className="bg-card  backdrop-blur-md w-full lg:w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
        {isArtist && <ImageAudioLoader progress={artistProgress} />}
        {!isArtist && (
          <>
            {!artistCoverImage ? (
              <ImageAudioUploader
                setImageURL={setArtistCoverImage}
                setAlert={setAlert}
                alertMsg={setAlertMsg}
                isLoading={setIsArtist}
                setProgress={setArtistProgress}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={artistCoverImage}
                  alt="uploaded image"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                  onClick={() => {
                    deleteImageObject(artistCoverImage);
                  }}
                >
                  <MdDelete className="text-white" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 ">
        <input
          type="text"
          placeholder="Artist Name"
          className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-transparent"
          value={singerName}
          onChange={(e) => setsingerName(e.target.value)}
        />

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <p className="text-base font-semibold text-gray-400">
            www.twitter.com/
          </p>
          <input
            type="text"
            placeholder="your id"
            className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-300 p-3 flex items-center rounded-md  shadow-sm border border-gray-300">
          <p className="text-base font-semibold text-gray-400">
            www.instagram.com/
          </p>
          <input
            type="text"
            placeholder="your id"
            className="w-full text-base font-semibold text-textColor outline-none bg-transparent"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>

        <div className="w-full lg:w-300 flex items-center justify-center lg:justify-end">
          {isArtist ? (
            <DisabledButton />
          ) : (
            <motion.button
              whileTap={{ scale: 0.75 }}
              className="px-8 py-2 rounded-md text-white bg-red-600 hover:shadow-lg"
              onClick={saveArtist}
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
