import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-5">
      {/* Animation */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <p className="text-2xl font-semibold text-gray-600 mt-2">
          Oops! Page Not Found
        </p>
        <p className="text-gray-500 mt-2">
          The page you are looking for doesn't exist or was moved.
        </p>

        {/* Button with Animation */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6"
        >
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
