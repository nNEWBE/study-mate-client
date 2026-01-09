import Banner from "../components/sections/Banner";
import Faq from "../components/sections/Faq";
import Features from "../components/sections/Features";
import { motion } from "framer-motion";
import NavMenu from "../components/layout/NavMenu";
import Create from "../components/sections/Create";
import BestAssignments from "../components/sections/BestAssignments";
import HowItWorks from "../components/sections/HowItWorks";
import StudyCategories from "../components/sections/StudyCategories";


const Home = (): JSX.Element => {
  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{ translateX: "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <NavMenu />
      <Banner />
      <HowItWorks />
      <Create />
      <Features />
      <StudyCategories />
      <BestAssignments />
      <Faq />
    </motion.div>
  );
};

export default Home;
