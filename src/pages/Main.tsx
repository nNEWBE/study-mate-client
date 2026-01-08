import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Aos from "aos";
import "aos/dist/aos.css";

import TopLoadingBar from "../components/TopLoadingBar";

import Cursor from "../animation/Cursor";

const Main = (): JSX.Element => {
  useEffect(() => {
    Aos.init();
  }, []);

  return (
    <div className="dark:bg-secondary">
      <Cursor />
      <TopLoadingBar />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Main;
