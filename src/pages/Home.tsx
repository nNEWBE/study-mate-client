import Banner from "../components/sections/Banner";
import UserReviews from "../components/sections/UserReviews";
import Faq from "../components/sections/Faq";
import Features from "../components/sections/Features";
import { motion } from "framer-motion";
import NavMenu from "../components/layout/NavMenu";
import Create from "../components/sections/Create";
import BestAssignments from "../components/sections/BestAssignments";
import HowItWorks from "../components/sections/HowItWorks";
import StudyCategories from "../components/sections/StudyCategories";


import { useState } from "react";

const Home = (): JSX.Element => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{ translateX: "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onAnimationComplete={() => setIsAnimationComplete(true)}
      style={isAnimationComplete ? { transform: "none" } : undefined}
    >
      <NavMenu />
      <Banner />
      <HowItWorks />
      <Create />
      <Features />
      <StudyCategories />
      <BestAssignments />
      <UserReviews />
      <Faq />
    </motion.div>
  );
};

export default Home;
