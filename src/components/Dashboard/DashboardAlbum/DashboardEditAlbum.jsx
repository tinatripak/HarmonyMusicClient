import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAlbumById,
  getAllAlbums,
  getAllArtist,
  updateAlbumById,
} from "../../../api";
import { storage } from "../../../config/firebase.config";
import { deleteObject, ref } from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { useStateValue } from "../../../Context/StateProvider";
import { actionType } from "../../../Context/reducer";
import FilterButtons from "../../Filter/FilterButtons";

import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";

const DashboardEditAlbum = () => {
  const { _id } = useParams();
  const [album, setAlbum] = useState();

  const [isAlbum, setIsAlbum] = useState(false);
  const [albumProgress, setAlbumProgress] = useState(0);

  const [, setAlert] = useState(false);
  const [, setAlertMsg] = useState(null);
  const [albumCoverImage, setAlbumCoverImage] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const navigate = useNavigate();
  const [{ artists, artistFilter }, dispatch] = useStateValue();

  useEffect(() => {
    async function fetchAlbum() {
      const response = await getAlbumById(_id);
      setAlbum(response.data);
    }
    (async () => {
      try {
        await fetchAlbum();
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
      }).catch((error) => {
        console.error(error);
      });
    }
  }, []);

  const [artistFlag, setArtistFlag] = useState("Виконавець");

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

  const updateAlbum = () => {
    setIsAlbum(true);
    console.log(
      album?._id,
      albumName !== "" ? albumName : album?.name,
      albumCoverImage ? albumCoverImage : album?.imageURL,
      artistFilter ? artistFilter : album?.artist
    );
    updateAlbumById(
      album?._id,
      albumName !== "" ? albumName : album?.name,
      albumCoverImage ? albumCoverImage : album?.imageURL,
      artistFilter ? artistFilter : album?.artist
    ).then((res) => {
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
    dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    navigate("/dashboard/albums");
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
    <div>
      <div className="text-2xl text-center mb-10 ">
        Редагування "{album?.name}"
      </div>
      <div className="flex items-center justify-evenly w-full flex-wrap">
        <div className="relative">
          <img
            src={album?.imageURL}
            alt="cover"
            className="object-cover	w-225 h-225"
          />
          {album?.imageURL && (
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <div className="w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
                {isAlbum && <ImageAudioLoader progress={albumProgress} />}
                {!isAlbum && (
                  <div>
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
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 ">
          <input
            type="text"
            placeholder={album?.name}
            className="w-full lg:w-300 p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-card"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
          <div>
            Оберіть нового виконавця або залиште{" "}
            <span className="font-semibold">{album?.artist}</span>
          </div>
          <div className="w-1/2">
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
                onClick={updateAlbum}
              >
                Зберегти
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEditAlbum;
