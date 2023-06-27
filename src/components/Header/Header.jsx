import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStateValue } from "../../Context/StateProvider";
import { isActiveStyles, isNotActiveStyles } from "../../utils/styles";
import { getAuth } from "firebase/auth";
import { app } from "../../config/firebase.config";
import { motion } from "framer-motion";
import { FiLogOut } from "react-icons/fi";
import { actionType } from "../../Context/reducer";

const Header = () => {
  const navigate = useNavigate();
  const [{ user }, dispatch] = useStateValue();
  const [isMenu, setIsMenu] = useState(false);

  const logout = () => {
    const firebaseAuth = getAuth(app);
    firebaseAuth
      .signOut()
      .then(() => {
        window.localStorage.setItem("auth", "false");
      })
      .catch((e) => console.log(e));
    dispatch({
      type: actionType.SET_USER,
      user: null,
    });
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <header className="grid grid-cols-3 mt-4 mx-10 gap-60">
      <div className="flex items-center col-span-2">
        <div className="logo text-red-600 font-semibold text-xl">
        <NavLink
          to={"/home"}
          style={{ textDecoration: "none" }}
        >
          Harmony
        </NavLink></div>
        <ul className="flex items-center justify-center ml-7 ">
          <li className="mx-3 text-md hover:underline hover:underline-offset-8 hover:decoration-red-600 hover:decoration-2 links">
            <NavLink
              to={"/home"}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              style={{ textDecoration: "none" }}
            >
              Головна
            </NavLink>
          </li>
          <li className="mx-3 text-md hover:underline hover:underline-offset-8 hover:decoration-red-600 hover:decoration-2 links">
            <NavLink
              to={"/music"}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              style={{ textDecoration: "none" }}
            >
              Музика
            </NavLink>
          </li>

          <li className="mx-3 text-md hover:underline hover:underline-offset-8 hover:decoration-red-600 hover:decoration-2 links">
            <NavLink
              to={"/singers"}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              style={{ textDecoration: "none" }}
            >
              Виконавці
            </NavLink>
          </li>
          <li className="mx-3 text-md hover:underline hover:underline-offset-8 hover:decoration-red-600 hover:decoration-2 links">
            <NavLink
              to={"/albums"}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              style={{ textDecoration: "none" }}
            >
              Альбоми
            </NavLink>
          </li>

          <li className="mx-3 text-md hover:underline hover:underline-offset-8 hover:decoration-red-600 hover:decoration-2 links">
            <NavLink
              to={"/suggest"}
              className={({ isActive }) =>
                isActive ? isActiveStyles : isNotActiveStyles
              }
              style={{ textDecoration: "none" }}
            >
              Запропонувати пісню
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="flex items-center">
        <div
          className="flex items-center ml-auto cursor-pointer gap-2 relative"
          onMouseEnter={() => setIsMenu(true)}
          onMouseLeave={() => setIsMenu(false)}
        >
          <img
            className="w-12 min-w-[44px] object-cover rounded-full shadow-lg"
            src={user?.user?.imageURL}
            alt=""
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{user?.user.name}</p>
            <p>{user?.user.email}</p>
          </div>

          {isMenu && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="absolute z-10 top-12 right-0 w-275 p-4 gap-4 bg-card shadow-lg rounded-lg backdrop-blur-sm flex flex-col"
            >
              <NavLink to={"/userProfile"}>
                <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                  Профіль
                </p>
              </NavLink>
              <NavLink to={"/favorites"}>
                <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                  Улюблені пісні
                </p>
              </NavLink>
              <hr />
              {user?.user.role === "admin" && (
                <>
                  <NavLink to={"/dashboard/home"}>
                    <p className="text-base text-textColor hover:font-semibold duration-150 transition-all ease-in-out">
                      Адмін-панель
                    </p>
                  </NavLink>
                </>
              )}
            </motion.div>
          )}
        </div>

        <div
          className="text-base cursor-pointer duration-150 transition-all ease-in-out ml-4"
          onClick={logout}
        >
          <FiLogOut className="text-xl" />
        </div>
      </div>
    </header>
  );
};

export default Header;
