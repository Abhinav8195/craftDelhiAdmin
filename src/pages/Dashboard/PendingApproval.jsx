import React from 'react';
import IconCube_02 from '../../assets/images/IconCube_02.png';
import IconImageIndentRight from '../../assets/images/IconImageIndentRight.png';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const PendingApproval = ({ card1,products }) => {
  // Parent container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  // Inner content animation (fade in from right)
  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <>
      <div className="text-black text-2xl font-bold font-['Montserrat'] mt-8 mb-4 text-center md:text-left">
        Pending Approvals
      </div>

      {/* Pending Approvals Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Card 1 */}
        <NavLink onClick={() => card1(2)}>
          <motion.div
            variants={cardVariants}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
            }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between cursor-pointer"
          >
            <motion.img
              src={IconCube_02}
              alt="Logo"
              className="w-10 h-10"
              variants={contentVariants}
            />
            <motion.div
              className="text-black text-base font-bold text-center"
              variants={contentVariants}
            >
              Products Pending Approval
            </motion.div>
            <motion.div
              className="text-black text-2xl font-bold"
              variants={contentVariants}
            >
              {products.length}
            </motion.div>
          </motion.div>
        </NavLink>

        {/* Card 2 */}
        <motion.div
          variants={cardVariants}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 8px 20px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-[200px] p-5 bg-gradient-to-b from-[#ffeaea] to-white rounded-xl border border-[#d9d9d9] flex flex-col items-center justify-between cursor-pointer"
        >
          <motion.img
            src={IconImageIndentRight}
            alt="Logo"
            className="w-10 h-10"
            variants={contentVariants}
          />
          <motion.div
            className="text-black text-base font-bold text-center"
            variants={contentVariants}
          >
            Products Pending Actions
          </motion.div>
          <motion.div
            className="text-black text-2xl font-bold"
            variants={contentVariants}
          >
            {products.length}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default PendingApproval;
