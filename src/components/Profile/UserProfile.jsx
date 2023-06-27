import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useStateValue } from "../../Context/StateProvider";
import "./profile.css";
import { FaUserEdit } from "react-icons/fa";
import { AiTwotoneHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [{ user }] = useStateValue();
  const navigate = useNavigate();
  const navigateToEditProfile = () => {
    navigate("/editProfile");
  };

  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary  pl-1">
      <Header />
      <div className="text-2xl text-center mb-10 mt-10">Профіль</div>
      <div className="card-container mb-32">
        <div className="head ">
          <FaUserEdit
            className="text-gray-800 mr-2 mt-2 cursor-pointer ml-72"
            size={30}
            onClick={navigateToEditProfile}
          />
        </div>
        <img src={user?.user?.imageURL} className="img rounded-full" />
        <h1 className="bold-text">{user?.user.name}</h1>
        <div className="text-base text-center">{user?.user.email}</div>
        <div>
          <div className="text-sm text-center mx-auto my-4 border-t-2 border-red-800">
            Кількість улюблених пісень
          </div>
          <div className="flex items-center justify-center mb-4">
            <div className="text-lg font-semibold">
              {user?.user.favourites.length}
            </div>
            <a href="/favorites">
              <AiTwotoneHeart
                size={50}
                className="text-red-600 hover:scale-120"
              />
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
