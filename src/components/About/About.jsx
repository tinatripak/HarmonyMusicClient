import React from "react";
import Header from "../Header/Header";
import "../Home/homeStyle.css";

const About = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />
      <div className="text-3xl font-semibold">Про нас</div>
      <div className="mt-5 text-lg font-medium">
        Наша місія – показати вам найгарніші українські пісні та дати можливість
        почути усім, яка неймовірна українська музика.
      </div>
    </div>
  );
};

export default About;
