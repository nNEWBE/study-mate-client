import Banner from "../components/Banner";
import Faq from "../components/Faq";
import Features from "../components/Features";
import { motion } from "framer-motion";
import NavMenu from "../components/NavMenu";
import Create from "../components/Create";
import BestAssignments from "../components/BestAssignments";

const Home = () => {
  return (
    <motion.div
      initial={{ translateX: "100%" }}
      animate={{
        translateX: "0%",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <NavMenu></NavMenu>
      <Banner></Banner>
      <Create></Create>
      <Features></Features>
      <BestAssignments />
      <Faq></Faq>
    </motion.div>
  );
};

export default Home;
