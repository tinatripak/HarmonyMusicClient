import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

import { motion } from "framer-motion";

const FilterButtons = ({ filterData, flag, setFilter }) => {
  const [filterMenu, setFilterMenu] = useState(false);

  const updateFilterButton = (name) => {
    setFilter(name);
    setFilterMenu(false);
  };

  return (
    <div className="border border-gray-300 rounded-md px-4 py-1 relative cursor-pointer hover:border-gray-400 bg-card">
      <p
        className="text-base tracking-wide text-textColor flex items-center gap-2 "
        onClick={() => setFilterMenu(!filterMenu)}
      >
        {flag}
        <IoChevronDown
          className={`text-base text-textColor duration-150 transition-all ease-in-out ${
            filterMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>
      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="z-50  backdrop-blur-sm max-h-44 overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 py-2 flex flex-col rounded-md shadow-md absolute top-8 left-0 bg-card"
        >
          {filterData?.map((data) => (
            <div
              key={data?.name}
              className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
              onClick={() => updateFilterButton(data?.name)}
            >
              {(flag === "Виконавець" || flag === "Альбом") && (
                <img
                  src={data?.imageURL}
                  className="w-8 min-w-[32px] h-8 rounded-full object-cover"
                  alt=""
                />
              )}
              <p className="w-full">
                {data?.name.length > 15
                  ? `${data?.name.slice(0, 14)}...`
                  : data?.name}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtons;
