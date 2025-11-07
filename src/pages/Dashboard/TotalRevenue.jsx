import React from 'react';
import IconCoins_04 from '../../assets/images/IconCoins_04.png';
import new1 from '../../assets/images/new1.png';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const TotalRevenue = ({ card1,revenue }) => {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 12 },
    },
  };

 
  const titleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "tween", duration: 0.6, ease: "easeOut" },
    },
  };

  const numberVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 10 },
    },
  };

  return (
    <>
      {/* Title */}
      <div className="text-black text-2xl font-bold font-['Montserrat'] mt-8 mb-4 text-center md:text-left">
        Total Revenue
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card 1 */}
        <NavLink onClick={() => card1(3)}>
          <motion.div
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between cursor-pointer"
          >
            <motion.img
              src={new1}
              alt="Logo"
              className="w-10 h-10"
              variants={imageVariants}
            />
            <motion.div
              className="text-black text-base font-bold text-center"
              variants={titleVariants}
            >
              Total Revenue
            </motion.div>
            <motion.div
              className="text-black text-2xl font-bold"
              variants={numberVariants}
            >
              {revenue.total_revenue}
            </motion.div>
          </motion.div>
        </NavLink>

        {/* Card 2 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 10px 25px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.97 }}
          className="h-[200px] p-5 bg-gradient-to-b from-[#fce4b3] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between cursor-pointer"
        >
          <motion.img
            src={IconCoins_04}
            alt="Logo"
            className="w-10 h-10"
            variants={imageVariants}
          />
          <motion.div
            className="text-black text-base font-bold text-center"
            variants={titleVariants}
          >
            Current Month Revenue
          </motion.div>
          <motion.div
            className="text-black text-2xl font-bold"
            variants={numberVariants}
          >
            {revenue.current_month_revenue}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default TotalRevenue;
