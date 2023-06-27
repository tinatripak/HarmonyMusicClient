import React, { useState, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import {
  Dashboard,
  Music,
  Loader,
  Login,
  UserProfile,
  Home,
  Genres,
  Singers,
  Albums,
  About,
  Contact,
  SuggestASong,
  AdminRoute,
  AlbumsOfSinger,
  SongsOfAlbum,
  FavoriteList,
} from "./components";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";
import { validateUser, getAllSongsInAsc } from "./api";
import { useStateValue } from "./Context/StateProvider";
import { actionType } from "./Context/reducer";
import { AnimatePresence } from "framer-motion";
import SignUp from "./components/SignUp/SignUp";
import EditProfile from "./components/Profile/EditProfile";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();
  const [{ user, allSongs }, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  const [, setAuth] = useState(false);
  // console.log(user)
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((userCred) => {
      if (userCred) {
        userCred
          .getIdToken()
          .then((token) => {
            if (!token) {
              const token_ = localStorage.getItem("token");
              return validateUser(token_);
            } else {
              return validateUser(token);
            }
          })
          .then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          })
          .catch((error) => {
            console.error("An error occurred:", error);
          });
        setIsLoading(false);
      } else {
        setAuth(false);
        dispatch({
          type: actionType.SET_USER,
          user: null,
        });
        setIsLoading(false);
        navigate("/login");
      }
    });
  }, []);

  useEffect(() => {
    if (!allSongs && user) {
      getAllSongsInAsc()
        .then((data) => {
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: data.data,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <AnimatePresence>
      <div className="h-auto flex items-center justify-center min-w-[680px]">
        {isLoading && (
          <div className="fixed inset-0 bg-loaderOverlay backdrop-blur-sm ">
            <Loader />
          </div>
        )}
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="/music" element={<Music />} />
          <Route path="/genres" element={<Genres />} />
          <Route path="/singers" element={<Singers />} />
          <Route path="/albums" element={<Albums />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/suggest" element={<SuggestASong />} />
          <Route path="/favorites" element={<FavoriteList />} />

          <Route element={<AdminRoute />}>
            <Route path={"/dashboard/*"} element={<Dashboard />} />
          </Route>
          <Route path="/userProfile" element={<UserProfile />} />

          <Route
            path="/albumsAndSonsBySinger/:name"
            element={<AlbumsOfSinger />}
          />
          <Route
            path="/singers/:singer/songsByAlbum/:name"
            element={<SongsOfAlbum singer />}
          />

          <Route path="*" element={<Navigate to="/home" />} />

          <Route index path="/home" element={<Home />} />
        </Routes>
      </div>
    </AnimatePresence>
  );
};

export default App;
