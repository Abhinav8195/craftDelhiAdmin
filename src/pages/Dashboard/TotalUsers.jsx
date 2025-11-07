import IconUserCheck_01 from "../../assets/images/IconUserCheck_01.png";
import IconShoppingBag_02 from "../../assets/images/IconShoppingBag_02.png";
import IconFaceContent from "../../assets/images/IconFaceContent.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TotalUsers = ({ card1,stats  }) => {

  const navigate = useNavigate();


  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 },
    },
  };

  // Card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  // Image animation (pop / rotate in)
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -45 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 12 },
    },
  };

  // Title animation (fade in from right)
  const titleVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "tween", duration: 0.6, ease: "easeOut" },
    },
  };

  // Number animation (bounce up)
  const numberVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 150, damping: 10 },
    },
  };

  const cardsData = [
    {
      id: 1,
      icon: IconUserCheck_01,
      title: "Total Number Of Users",
      value: stats?.total_users || 0,
      gradient: "from-[#ffe2e6] to-white",
      onClick: () => card1(1),
    },
    {
      id: 2,
      icon: IconShoppingBag_02,
      title: "Total Number Of Active Sellers",
      value: stats?.active_sellers || 0,
      gradient: "from-[#fff4de] to-white",
      onClick: () => navigate("/sellers"),
    },
    {
      id: 3,
      icon: IconFaceContent,
      title: "Total Number Of Active Buyers",
      value: stats?.active_buyers || 0,
      gradient: "from-green-100 to-white",
      onClick: () => navigate("/buyers"),
    },
  ];

  return (
    <>
      <div className="text-black text-2xl font-bold font-['Montserrat'] mb-3 text-center md:text-left">
        Total Users
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {cardsData.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.97 }}
            className={`h-[180px] p-5 bg-gradient-to-b ${card.gradient} rounded-xl border border-[#d9d9d9] flex flex-col justify-between cursor-pointer`}
            onClick={card.onClick}
          >
            <motion.img
              src={card.icon}
              alt="Icon"
              className="w-10 h-10"
              variants={imageVariants}
            />
            <motion.div
              className="text-black text-base font-bold"
              variants={titleVariants}
            >
              {card.title}
            </motion.div>
            <motion.div
              className="text-black text-2xl font-bold"
              variants={numberVariants}
            >
              {card.value}
            </motion.div>
            <motion.div
              className="text-[#2d53d8] text-xs font-bold"
              variants={titleVariants}
            >
              +8 from yesterday
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
};

export default TotalUsers;
