import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllArtist, getSingerById, updateSingerById } from "../../../api";
import { deleteObject, ref } from "firebase/storage";
import { motion } from "framer-motion";
import { MdDelete } from "react-icons/md";
import { storage } from "../../../config/firebase.config";
import { useStateValue } from "../../../Context/StateProvider";
import { actionType } from "../../../Context/reducer";
import ImageAudioLoader from "../../Additional/ImageAudioLoader";
import ImageAudioUploader from "../../Additional/ImageAudioUploader";
import DisabledButton from "../../Additional/DisabledButton";

const DashboardEditSinger = () => {
  const { _id } = useParams();
  const [singer, setSinger] = useState();

  const [isArtist, setIsArtist] = useState(false);
  const [artistProgress, setArtistProgress] = useState(0);

  const [, setAlert] = useState(false);
  const [, setAlertMsg] = useState(null);
  const [artistCoverImage, setArtistCoverImage] = useState(null);

  const [singerName, setSingerName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");

  const navigate = useNavigate();
  const [dispatch] = useStateValue();

  useEffect(() => {
    async function fetchSinger() {
      const response = await getSingerById(_id);
      setSinger(response.data);
    }
    (async () => {
      try {
        await fetchSinger();
      } catch (error) {
        console.error(error);
      }
    })();
  }, [_id]);

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

  const updateSinger = () => {
    setIsArtist(true);
    updateSingerById(
      singer?._id,
      singerName !== "" ? singerName : singer?.name,
      artistCoverImage ? artistCoverImage : singer?.imageURL,
      twitter !== "" ? twitter : singer?.twitter,
      instagram !== "" ? instagram : singer?.instagram
    ).then((res) => {
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
    setSingerName("");
    setTwitter("");
    setInstagram("");
    navigate("/dashboard/singers");
  };

  return (
    <div>
      <div className="text-2xl text-center mb-10 ">
        Редагування "{singer?.name}"
      </div>
      <div className="flex items-center justify-evenly w-full flex-wrap">
        <div className="relative">
          <img
            src={singer?.imageURL}
            alt="cover"
            className="object-cover	w-225 h-225"
          />
          {singer?.imageURL && (
            <div className="absolute top-0 left-0 right-0 bottom-0">
              <div className="w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer">
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
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-4 ">
          <input
            type="text"
            placeholder={singer?.name}
            className="p-3 w-full rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-gray-300 bg-card"
            value={singerName}
            onChange={(e) => setSingerName(e.target.value)}
          />

          <div className="p-3 w-96 flex items-center rounded-md  shadow-sm border border-gray-300 bg-card">
            <p className="text-base font-semibold text-gray-400">
              www.twitter.com/
            </p>
            <input
              type="text"
              placeholder={singer?.twitter}
              className="text-base font-semibold text-textColor outline-none"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>

          <div className="w-96 p-3 flex items-center rounded-md  shadow-sm border border-gray-300 bg-card">
            <p className="text-base font-semibold text-gray-400">
              www.instagram.com/
            </p>
            <input
              type="text"
              placeholder={singer?.instagram}
              className="w-full text-base font-semibold text-textColor outline-none"
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
                onClick={updateSinger}
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

export default DashboardEditSinger;
