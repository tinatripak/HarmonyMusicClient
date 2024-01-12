import axios from "axios";

const baseURL = "https://harmony-music.onrender.com/";

export const validateUser = async (token) => {
  try {
    if(token){
      const res = await axios.get(`${baseURL}api/users/login`, {
        headers: {
          authorization: "Bearer " + token,
        },
      });
    return res.data;
  }
  } catch (error) {
    return null;
  }
};

export const loginUser = async (token, email, password) => {
  try {
    if (token && email && password) {
      const res = await axios.post(`${baseURL}api/users/loginEmail`, {
        email: email,
        password: password
      }, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      return res.data;
    }
  } catch (error) {
    return null;
  }
};

export const registerUser = async (userData) => {
  try {
    if(userData){
      const res = await axios.post(`${baseURL}api/users/register`, userData );
      return res.data;
    }
  } catch (error) {
    return null;
  }
};

export const getAllArtist = async () => {
  try {
    const res = await axios.get(`${baseURL}api/singers/getSingersInAsc`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseURL}api/users/getUsers`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const removeUser = async (userId) => {
  try {
    const res = await axios.delete(`${baseURL}api/users/deleteUserById/${userId}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const updatePhotoUser = async (userId, imageURL) => {
  try {
    const res = await axios.put(`${baseURL}api/users/updatePhotoUserById/${userId}`, {
      data: { 
        imageURL: imageURL 
      },
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const updateNameAndEmailUser = async (userId, name, email) => {
  try {
    const res = await axios.put(`${baseURL}api/users/updateNameAndEmailUserById/${userId}`, {
      data:{
        name: name,
        email: email
      }
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const getAllSongsInAsc = async () => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getSongsInAsc`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllAlbums = async () => {
  try {
    const res = await axios.get(`${baseURL}api/albums/getAlbumsInAsc`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAlbumsBySinger = async (singerName) => {
  try {
    const res = await axios.get(`${baseURL}api/albums/getAlbumsBySinger/${singerName}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getSongsBySinger = async (singer) => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getSongsBySinger/${singer}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getSongsByAlbum = async (album) => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getSongsByAlbum/${album}`);
    return res.data;
  } catch (error) {
    return null;
  }
};


export const updateRole = async (userId, role) => {
  try {
    const res = await axios.put(`${baseURL}api/users/updateRoleById/${userId}`, {
      data: { role: role },
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const saveNewSinger = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/singers/saveSinger`, { ...data });
    return res.data.artist;
  } catch (error) {
    return null;
  }
};

export const saveNewAlbum = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/albums/saveAlbum`, { ...data });
    return res.data.album;
  } catch (error) {
    return null;
  }
};

export const saveNewSong = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/songs/saveSong`, { ...data });
    return res.data.song;
  } catch (error) {
    return null;
  }
};

export const getSuggestedSongs = async () => {
  try {
    const res = await axios.get(`${baseURL}api/suggestedSongs/getAll`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const saveNewSuggestedSong = async (data) => {
  try {
    if(data){
      const res = await axios.post(`${baseURL}api/suggestedSongs/saveSuggestedSong`, { ...data });

      return res.data.song;
    }
  } catch (error) {
    return null;
  }
};

export const deleteSuggestedSongById = async (id) => {
  try {
    if(id){
      const res = await axios.delete(`${baseURL}api/suggestedSongs/deleteSuggestedSongById/${id}`);
    return res;}
  } catch (error) {
    return null;
  }
};


export const deleteSongById = async (id) => {
  try {
    if(id){
      const res = await axios.delete(`${baseURL}api/songs/deleteSongById/${id}`);
    
    return res;}
  } catch (error) {
    return null;
  }
};

export const deleteAlbumById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}api/albums/deleteAlbumById/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const deleteSingerById = async (id) => {
  try {
    const res = await axios.delete(`${baseURL}api/singers/deleteSingerById/${id}`);
    return res;
  } catch (error) {
    return null;
  }
};
export const saveNewFavoriteSong = async (_id, data) => {
  try {
    const res = await axios.put(`${baseURL}api/users/addSongToFavourites/${_id}`, { songId: data });
    return res;
  } catch (error) {
    return null;
  }
};

export const getFavourites = async (_id) => {
  try {
    if(_id){
    const res = await axios.get(`${baseURL}api/users/getFavourites/${_id}`);
    return res.data;
    }
  } catch (error) {
    return null;
  }
};

export const getSongsByIds = async (songIds) => {
  try {
    if(songIds){
      const res = await axios.get(`${baseURL}api/songs/getSongsByIds?songIds=${encodeURIComponent(JSON.stringify(songIds))}`);
      return res.data;
    }
  } catch (error) {
    return null;
  }
};

export const deleteOneFromFavourites = async (_id, data) => {
  try {
    const res = await axios.put(`${baseURL}api/users/deleteSongFromFavourites/${_id}`, { songId: data });
    return res;
  } catch (error) {
    return null;
  }
};

export const updateSingerById = async (userId, name, imageURL, twitter, instagram) => {
  try {
    const res = await axios.put(`${baseURL}api/singers/updateSingerById/${userId}`, {
      data:{
        name: name,
        imageURL: imageURL,
        twitter: twitter,
        instagram: instagram,
      }
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const updateSongById = async (userId, songArr) => {
  try {
    const res = await axios.put(`${baseURL}api/songs/updateSongById/${userId}`, {
      data: songArr
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const updateAlbumById = async (userId, name, imageURL, artist) => {
  try {
    const res = await axios.put(`${baseURL}api/albums/updateAlbumById/${userId}`, {
      data:{
        name: name,
        imageURL: imageURL,
        artist: artist,
      }
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const getSongById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/songs/getSongById/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAlbumById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/albums/getAlbumById/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getSingerById = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/singers/getSingerById/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const deleteSongsByAlbum = async (albumName) => {
  try {
    const res = await axios.delete(`${baseURL}api/songs/deleteSongsByAlbum/${albumName}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const deleteSongsBySinger = async (singerName) => {
  try {
    const res = await axios.delete(`${baseURL}api/songs/deleteSongsBySinger/${singerName}`);
    return res;
  } catch (error) {
    return null;
  }
};

export const deleteAlbumsBySinger = async (singerName) => {
  try {
    const res = await axios.delete(`${baseURL}api/albums/deleteAlbumsBySinger/${singerName}`);
    return res;
  } catch (error) {
    return null;
  }
};