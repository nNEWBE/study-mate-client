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




const Home = (): JSX.Element => {


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
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
