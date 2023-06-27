import React, { useEffect, useState } from "react";
import { actionType } from "../../Context/reducer";
import { useStateValue } from "../../Context/StateProvider";
import { getAlbumsBySinger, getAllAlbums, getAllArtist } from "../../api";
import { filterByLanguage, filterByGenre } from "../../utils/supportfunctions";
import FilterButtons from "./FilterButtons";
import { AiOutlineClear } from "react-icons/ai";
import { motion } from "framer-motion";

const Filter = () => {
  const [{ artists, allAlbums, artistFilter }, dispatch] = useStateValue();
  const [artistFlag, setArtistFlag] = useState("Виконавець");
  const [categoryFlag, setCategoryFlag] = useState("Жанр");
  const [albumFlag, setAlbumFlag] = useState("Альбом");
  const [languageFlag, setLanguageFlag] = useState("Мова");
  const [yearFlag, setYearFlag] = useState("Рік");

  const [albumsOfSingers, setAlbumsOfSingers] = useState("");

  useEffect(() => {
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

    if (artistFilter !== null) {
      getAlbumsBySinger(artistFilter).then((response) => {
        setAlbumsOfSingers(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }
  }, [artists, allAlbums, artistFilter, dispatch]);

  const clearAllFilter = () => {
    setArtist("Виконавець");
    setCategory("Жанр");
    setAlbum("Альбом");
    setLanguage("Мова");
    setYear("Рік");
  };

  const setArtist = (name) => {
    setArtistFlag(name);
    if (name === "Виконавець") {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: null });
    } else {
      dispatch({ type: actionType.SET_ARTIST_FILTER, artistFilter: name });
    }
    setAlbum("Альбом");
  };

  const setAlbum = (name) => {
    setAlbumFlag(name);
    if (name === "Альбом") {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: null });
    } else {
      dispatch({ type: actionType.SET_ALBUM_FILTER, albumFilter: name });
    }
  };

  const setCategory = (name) => {
    setCategoryFlag(name);
    if (name === "Жанр") {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: null });
    } else {
      dispatch({ type: actionType.SET_FILTER_TERM, filterTerm: name });
    }
  };

  const setLanguage = (name) => {
    setLanguageFlag(name);
    if (name === "Мова") {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: null });
    } else {
      dispatch({ type: actionType.SET_LANGUAGE_FILTER, languageFilter: name });
    }
  };

  const setYear = (name) => {
    setYearFlag(name);
    if (name === "Рік") {
      dispatch({ type: actionType.SET_YEAR_FILTER, yearFilter: null });
    } else {
      dispatch({ type: actionType.SET_YEAR_FILTER, yearFilter: name });
    }
  };

  const getDropList = () => {
    const year = new Date().getFullYear();
    const dropList = [];

    for (let i = 0; i < 120; i++) {
      const obj = {
        id: i + 1,
        name: String(year - i),
        value: year - i,
      };

      dropList.push(obj);
    }

    return dropList;
  };
  const filterByYear = getDropList();

  return (
    <div className="w-full my-4 px-6 py-4 flex items-center justify-start md:justify-center gap-10 text-black">
      <FilterButtons
        filterData={artists}
        flag={artistFlag}
        setFilter={setArtist}
      />
      {artistFilter !== null && albumsOfSingers.length > 0 && (
        <FilterButtons
          filterData={albumsOfSingers}
          flag={albumFlag}
          setFilter={setAlbum}
        />
      )}
      <FilterButtons
        filterData={filterByGenre}
        flag={categoryFlag}
        setFilter={setCategory}
      />
      <FilterButtons
        filterData={filterByLanguage}
        flag={languageFlag}
        setFilter={setLanguage}
      />
      <FilterButtons
        filterData={filterByYear}
        flag={yearFlag}
        setFilter={setYear}
      />

      <motion.i
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileTap={{ scale: 0.75 }}
        onClick={clearAllFilter}
      >
        <AiOutlineClear className="text-textColor text-xl cursor-pointer" />
      </motion.i>
    </div>
  );
};

export default Filter;