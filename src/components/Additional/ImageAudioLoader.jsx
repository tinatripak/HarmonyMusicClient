import React from "react";

const ImageAudioLoader = ({ progress }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
      </p>
      <div className="w-20 h-20 min-w-[40px] bg-red-600  animate-ping  rounded-full flex items-center justify-center relative">
        <div className="absolute inset-0 rounded-full bg-red-600 blur-xl "></div>
      </div>
    </div>
  );
};

export default ImageAudioLoader;
