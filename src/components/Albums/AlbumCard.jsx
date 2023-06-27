import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const AlbumCard = ({ data, index }) => {
    const navigate = useNavigate();
    const handleClick = () =>
      navigate(`/singers/${data?.artist}/songsByAlbum/${data?.name}`);
  
    return (
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative hover:scale-105  overflow-hidden min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg"
        onClick={() => handleClick()}
      >
        <img
          src={data?.imageURL}
          className="w-52 h-52 rounded-lg drop-shadow-lg relative object-cover overflow-hidden px-2"
          alt=""
        />
  
        <p className="text-base text-headingColor font-semibold my-2 text-center">
          {data?.name.length > 25 ? `${data?.name.slice(0, 25)}` : data?.name}
          <span className="block text-sm text-gray-400 my-1">{data?.artist}</span>
        </p>
      </motion.div>
    );
  };

export default AlbumCard