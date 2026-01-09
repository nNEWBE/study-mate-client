import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { animateScroll } from "react-scroll";

const ScrollToTop = (): null => {
  const { pathname } = useLocation();

  useEffect(() => {
    const options = {
      duration: 500,
      smooth: "easeInOutQuint",
    };

    animateScroll.scrollToTop(options);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
