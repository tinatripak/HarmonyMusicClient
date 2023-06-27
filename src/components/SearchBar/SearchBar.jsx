import React from "react";
import { IoSearch } from "react-icons/io5";
import { actionType } from "../../Context/reducer";
import { useStateValue } from "../../Context/StateProvider";

const SearchBar = () => {
  const [{ searchTerm }, dispatch] = useStateValue();

  const setSearchTerm = (value) => {
    dispatch({
      type: actionType.SET_SEARCH_TERM,
      searchTerm: value,
    });
  };

  return (
    <div className="h-16 flex items-center ">
      <div className="gap-4 p-4 w-508  bg-card shadow-2xl rounded-full flex items-center ">
        <IoSearch className="text-2xl text-textColor" />
        <input
          type="text"
          value={searchTerm}
          className="h-full bg-transparent text-lg text-textColor font-semibold  outline-none "
          placeholder="Я шукаю ...."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;