"use client";

import ScrollToTop from "react-scroll-to-top";

const ScrollToTopClient = () => (
  <ScrollToTop
    smooth
    style={{
      width: "32px",
      height: "35px",
      borderRadius: "50%",
    }}
    component={
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="black"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L6 12h12L12 2zM6 18h12v2H6v-2z" />
      </svg>
    }
  />
);

export default ScrollToTopClient;
