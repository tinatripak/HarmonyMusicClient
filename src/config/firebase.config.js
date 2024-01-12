import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzUXFW-IVDU-yGHqFo3eGk8PdgaYYyemY",
  authDomain: "musicapp-5ed7e.firebaseapp.com",
  projectId: "musicapp-5ed7e",
  storageBucket: "musicapp-5ed7e.appspot.com",
  messagingSenderId: "314585488878",
  appId: "1:314585488878:web:6d6db5eb041522511d42ff"
};
console.log(firebaseConfig)
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const storage = getStorage(app);

export { app, storage };