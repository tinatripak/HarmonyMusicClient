import React, { useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useStateValue } from "../../Context/StateProvider";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import {
  updatePassword,
  getAuth,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { IoIosArrowBack } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../../config/firebase.config";
import { updateNameAndEmailUser, updatePhotoUser } from "../../api";
import ImageAudioLoader from "../Additional/ImageAudioLoader";
import ImageAudioUploader from "../Additional/ImageAudioUploader";
import DisabledButton from "../Additional/DisabledButton";
import { motion } from "framer-motion";
import './editProfile.css'
import { actionType } from "../../Context/reducer";


const EditProfile = () => {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [equalityPasswordError, setEqualityPasswordsError] = useState("");


  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const navigateToYourProfile = () => {
    navigate("/userProfile");
  };

  const [photoProgress, setPhotoProgress] = useState(0);
  const [photoProfile, setPhotoProfile] = useState(null);
  const [isUser, setIsUser] = useState(false);
  const [alert, setAlert] = useState(false);
  const [, setAlertMsg] = useState(null);
  const [, setError] = useState("");

  const deleteImageObject = (songURL) => {
    setIsUser(true);
    setPhotoProfile(null);
    const deleteRef = ref(storage, songURL);
    deleteObject(deleteRef)
      .then(() => {
        setAlert("success");
        setAlertMsg("File removed successfully");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
        setIsUser(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updateThisProfile = () => {
    try {
      if (newName.length < 5) {
        setNameError("Ім'я і прізвище повинно містити принаймні п'ять символів");
      } else {
        setNameError("");
      }
      if (newEmail.length < 7) {
        setEmailError("Електронна пошта повинна містити принаймні сім символів");
      } else {
        setEmailError("");
      }
  
      if (!newName || !newEmail) {
        setAlert("error");
        setAlertMsg("Required fields are missing");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
      } else {
        setIsUser(true);
        updateNameAndEmailUser(user?.user?._id, newName, newEmail)
          .then(((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data?.data,
            });
          }))
          .catch((err) => {
            setError(err.message);
          });
        setIsUser(false);
        setNewName("");
        setNewEmail("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePhotoProfile = () => {
    try {

      updateProfile(currentUser, {
        photoURL: photoProfile,
      })
        .then(() => {})
        .catch((err) => {
          setError(err.message);
        });

      if (!photoProfile) {
        setAlert("error");
        setAlertMsg("Required fields are missing");
        setTimeout(() => {
          setAlert(null);
        }, 4000);
      } else {
        setIsUser(true);
        updatePhotoUser(user?.user?._id, photoProfile)
          .then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data?.data,
            });
          })
          .catch((err) => {
            setError(err.message);
          });
        setIsUser(false);
        setPhotoProfile(null);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const updatePasswordOfProfile = () => {
    try {
      if (!currentPassword) {
        setCurrentPasswordError("Ваш пароль не введений або не вірний");
      } else {
        setCurrentPasswordError("");
      }
      if (!newPassword || newPassword.length<6) {
        setNewPasswordError("Новий пароль не введений або містить менше шістьох символів");
      } else {
        setNewPasswordError("");
      }
      if(currentPassword !== newPassword){
        setEqualityPasswordsError("Паролі не співпадають");
      } else {
        setEqualityPasswordsError("");
      }
      
      if (currentUser) {
        const email = currentUser.email;
        const credential = EmailAuthProvider.credential(email, currentPassword);
        reauthenticateWithCredential(currentUser, credential)
          .then(() => {})
          .catch((err) => {
            setError(err.message);
          });
        updatePassword(currentUser, newPassword)
          .then(() => {})
          .catch((err) => {
            setError(err.message);
          });
      }
    } catch (error) {
      // alert("Пароль невірний");
    }
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary  pl-1">
      <Header />
      <div className="text-2xl text-center mb-10 mt-10">
        Редагування профілю
      </div>
      <div className="bg-card mb-32 py-10 px-10 shadow-2xl rounded-lg">
        <IoIosArrowBack
          size={30}
          onClick={navigateToYourProfile}
          className="cursor-pointer"
        />
        <div className="grid grid-cols-2">
          <div>
            <div className="relative">
              <img
                src={user?.user?.imageURL}
                alt="cover"
                className="object-cover	w-225 h-225 mx-auto"
              />
              {console.log(user?.user?.imageURL)}
              {user?.user?.imageURL && (
                <div className="absolute top-0 left-0 right-0 bottom-0">
                  <div className="w-225 h-225 rounded-md border-2 border-dotted border-gray-300 cursor-pointer mx-auto">
                    {isUser && <ImageAudioLoader progress={photoProgress} />}
                    {!isUser && (
                      <div>
                        {!photoProfile ? (
                          <ImageAudioUploader
                            setImageURL={setPhotoProfile}
                            setAlert={setAlert}
                            alertMsg={setAlertMsg}
                            isLoading={setIsUser}
                            setProgress={setPhotoProgress}
                            isImage={true}
                          />
                        ) : (
                          <div className="relative smx-auto  h-full overflow-hidden rounded-md">
                            <img
                              src={photoProfile}
                              alt="uploaded image"
                              className="object-cover w-240 h-225"
                            />
                            <button
                              type="button"
                              className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                              onClick={() => {
                                deleteImageObject([photoProfile]);
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

            <div className="flex items-center justify-between mt-5 gap-5 ml-3">
              <button
                type="submit"
                className="px-3 text-black border-2 border-gray-300 py-2 sign-button mx-auto"
                onClick={updatePhotoProfile}
              >
                Зберегти
              </button>
            </div>
          </div>
          <div>
            <div>
              <div className="mb-3">
                <label>
                  <span>Ім'я:</span>
                  <input
                    className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                    type="text"
                    placeholder={user?.user.name}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                  {nameError && (<p className="text-red-600 ml-3 px-4 ">{nameError}</p>)}
                </label>
              </div>
              <div className="mb-3">
                <label>
                  <span>Електронна пошта:</span>
                  <input
                    className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                    type="email"
                    placeholder={user?.user.email}
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  {emailError && (<p className="text-red-600 ml-3 px-4 ">{emailError}</p>)}
                </label>
              </div>
              <div className="flex items-center justify-between mt-5 gap-5 ml-3">
                <label></label>
                <button
                  type="submit"
                  className="px-3 text-black border-2 border-gray-300 py-2 sign-button"
                  onClick={updateThisProfile}
                >
                  Зберегти
                </button>
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-3">
                <label>
                  <span>Дійсний пароль:</span>
                  <input
                    className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                    type="password"
                    placeholder="Старий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {currentPasswordError && (<p className="text-red-600 ml-3 px-4 ">{currentPasswordError}</p>)}
                  </label>
              </div>
              <div className="mb-3">
                <label>
                  <span>Новий пароль:</span>
                  <input
                    className="border-2 border-gray-300 rounded-md py-2 px-4 ml-3"
                    type="password"
                    placeholder="Майбутній пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {newPasswordError && (<p className="text-red-600 ml-3 px-4 ">{newPasswordError}</p>)}
                  {equalityPasswordError && (<p className="text-red-600 ml-3 px-4 ">{equalityPasswordError}</p>)}

                </label>
              </div>
              <div className="flex items-center justify-between mt-5 gap-5 ml-3">
                <label></label>
                <button
                  type="submit"
                  className="px-3 text-black border-2 border-gray-300 py-2 sign-button"
                  onClick={updatePasswordOfProfile}
                >
                  Зберегти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditProfile;
