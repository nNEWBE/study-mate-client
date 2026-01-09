import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";

import TopLoadingBar from "../components/layout/TopLoadingBar";

import Cursor from "../components/ui/Cursor";

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
