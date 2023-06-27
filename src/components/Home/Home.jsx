import React from "react";
import Header from "../Header/Header";
import image from "../../images/scryabin.jpg";
import "../Home/homeStyle.css";
import Footer from "../Footer/Footer";

const Home = () => {
  return (
    <>
      <div
        className="w-full h-auto flex flex-col items-center justify-center text-whiteTextColor"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          overflow: "hidden",
        }}
      >
        <Header />

        <div className="text-4xl text-redColor font-semibold m-80">
          Music is everybody's life. It's forever
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
