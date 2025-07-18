import { useState, useEffect } from "react";

const ScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > threshold) setScrolled(true);
      else setScrolled(false);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.addEventListener("scroll", handleScroll);
  }, [threshold]);
  return scrolled;
};

export default ScrollTop;
