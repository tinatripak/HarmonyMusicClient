import React from "react";
import { IoHome } from "react-icons/io5";
import { NavLink, Route, Routes } from "react-router-dom";
import { isActiveStyles, isNotActiveStyles } from "../../utils/styles";
import DashboardAlbum from "./DashboardAlbum/DashboardAlbum";
import DashboardArtist from "./DashboardSinger/DashboardArtist";
import DashBoardHome from "./DashBoardHome";
import DashboardSongs from "./DashboardSong/DashboardSongs";
import DashboardUser from "./DashboardUser/DashboardUser";
import Header from "../Header/Header";
import DashboardNewSong from "./DashboardSong/DashboardNewSong";
import DashboardNewArtist from "./DashboardSinger/DashboardNewArtist";
import DashboardNewAlbum from "./DashboardAlbum/DashboardNewAlbum";
import DashboardSuggestedSongs from "./DashboardSong/DashboardSuggestedSongs";
import DashboardEditAlbum from "./DashboardAlbum/DashboardEditAlbum";
import DashboardEditSinger from "./DashboardSinger/DashboardEditSinger";
import DashboardEditSong from "./DashboardSong/DashboardEditSong";

const Dashboard = () => {
  return (
    <div className="mx-auto w-full justify-center flex">
      <div className="w-full h-auto flex flex-col items-center justify-center bg-primary ml-14 pl-1 ">
        <Header />

        <NavLink to={"/dashboard/home"}>
          <IoHome className="text-5xl text-textColor text-center mt-3 border-2 border-gray-700 rounded-full px-2" />
        </NavLink>
        <div className="w-[60%] my-2 p-4 flex items-center justify-evenly ">
          <NavLink
            to={"/dashboard/users"}
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            {" "}
            Користувачі{" "}
          </NavLink>
          <NavLink
            to={"/dashboard/songs"}
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            {" "}
            Пісні{" "}
          </NavLink>
          <NavLink
            to={"/dashboard/singers"}
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            {" "}
            Виконавці{" "}
          </NavLink>
          <NavLink
            to={"/dashboard/albums"}
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            {" "}
            Альбоми{" "}
          </NavLink>
          <NavLink
            to={"/dashboard/suggested-songs"}
            className={({ isActive }) =>
              isActive ? isActiveStyles : isNotActiveStyles
            }
          >
            {" "}
            Запропоновані пісні{" "}
          </NavLink>
        </div>

        <div className="my-4 w-full p-5 h-510">
          <Routes>
            <Route path="/home" element={<DashBoardHome />} />
            <Route path="/users" element={<DashboardUser />} />
            <Route
              path="/suggested-songs"
              element={<DashboardSuggestedSongs />}
            />
            <Route path="/songs" element={<DashboardSongs />} />
            <Route path="/singers" element={<DashboardArtist />} />
            <Route path="/albums" element={<DashboardAlbum />} />
            <Route path="/newSong" element={<DashboardNewSong />} />
            <Route path="/newArtist" element={<DashboardNewArtist />} />
            <Route path="/newAlbum" element={<DashboardNewAlbum />} />
            <Route path="/editAlbum/:_id" element={<DashboardEditAlbum />} />
            <Route path="/editSinger/:_id" element={<DashboardEditSinger />} />
            <Route path="/editSong/:_id" element={<DashboardEditSong />} />
          </Routes>
        </div>
        {/* <Footer/> */}
      </div>
    </div>
  );
};

export default Dashboard;
