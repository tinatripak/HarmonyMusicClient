import React, { useEffect } from "react";
import { FaUserFriends } from "react-icons/fa";
import { SiYoutubemusic } from "react-icons/si";
import { IoIosMicrophone } from "react-icons/io";
import { MdLibraryMusic, MdAdd } from "react-icons/md";

import {
  getAllAlbums,
  getAllArtist,
  getAllSongsInAsc,
  getAllUsers,
  getSuggestedSongs,
} from "../../api";
import { actionType } from "../../Context/reducer";
import { useStateValue } from "../../Context/StateProvider";

export const DashboardCard = ({ icon, name, count, bg_color }) => {
  return (
    <div
      style={{ background: `${bg_color}` }}
      className={`p-8 px-20 w-52 gap-10 h-auto rounded-lg shadow-md flex items-center justify-center`}
    >
      <div>
        <p className="text-textColor text-2xl">{count}</p>
        <p className="text-textColor text-base font-semibold">{name}</p>
      </div>
      <div>{icon}</div>
    </div>
  );
};

const DashBoardHome = () => {
  const [
    { allUsers, allSongs, allSuggestedSongs, artists, allAlbums },
    dispatch,
  ] = useStateValue();
  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        dispatch({
          type: actionType.SET_ALL_USERS,
          allUsers: data.data,
        });
      }).catch((error) => {
        console.error(error);
      });
    }

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

    if (!artists) {
      getAllArtist().then((data) => {
        dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }

    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMNS, allAlbums: data.data });
      }).catch((error) => {
        console.error(error);
      });
    }

    if (!allSuggestedSongs) {
      getSuggestedSongs().then((data) => {
        dispatch({
          type: actionType.SET_ALL_SUGGESTED_SONGS,
          allSuggestedSongs: data.data,
        });
      }).catch((error) => {
        console.error(error);
      });
    }
  }, []);
  return (
    <div className="w-full p-6 flex items-center justify-evenly flex-wrap">
      <DashboardCard
        icon={<FaUserFriends className="text-gray-500 text-3xl" />}
        name={"Користувачі"}
        count={allUsers?.length > 0 ? allUsers?.length : 0}
        bg_color="#fee2e2"
      />
      <DashboardCard
        icon={<SiYoutubemusic className="text-3xl text-gray-500" />}
        name={"Пісні"}
        count={allSongs?.length > 0 ? allSongs?.length : 0}
        bg_color="#dbeafe"
      />
      <DashboardCard
        icon={<IoIosMicrophone className="text-3xl text-gray-500" />}
        name={"Виконавці"}
        count={artists?.length > 0 ? artists?.length : 0}
        bg_color="#e9d5ff"
      />
      <DashboardCard
        icon={<MdLibraryMusic className="text-3xl text-gray-500" />}
        name={"Альбоми"}
        count={allAlbums?.length > 0 ? allAlbums?.length : 0}
        bg_color="#d1fae5"
      />
      <DashboardCard
        icon={<MdAdd className="text-3xl text-gray-500" />}
        name={"Запропоновані"}
        count={allSuggestedSongs?.length > 0 ? allSuggestedSongs?.length : 0}
        bg_color="#fef08a"
      />
    </div>
  );
};

export default DashBoardHome;
