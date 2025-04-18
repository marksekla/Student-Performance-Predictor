import React from "react";
import { Outlet } from "react-router-dom";
import WebAppBar from "./components/WebAppBar";
import { WebAppBarLink } from "./components/WebAppBar/interfaces";
import { Box } from "@mui/material";
import Footer from "./components/Footer";

/* Define WebAppBar Links */
const webAppBarLinks: WebAppBarLink[] = [
  { title: "Home", anchor: "/#maindiv-001" },
  { title: "Features", anchor: "/#subdiv-002" },
  { title: "Our Team", anchor: "/#team" },
  { title: "Contact", anchor: "/#contact" },
];

function App() {
  /* AppBar and Events State */
  const [translucentAppBarTop, setTranslucentAppBarTop] = React.useState(-120);

  React.useEffect(() => {
    function handleScrollWebAppBar() {
      /* Use Minimum Scroll Listeners. Performance is Important. */
      const scrollY = window.scrollY;
    
      /* Set App Bar to Translucent Mode if Scroll is Over 100 */
      setTranslucentAppBarTop(Math.min(scrollY - 120, 0));
    }

    /* Detect Webpage Scroll */
    window.addEventListener("scroll", handleScrollWebAppBar);

    /* Cleanup Function */
    return () => {
      window.removeEventListener("scroll", handleScrollWebAppBar);
    }
  }, []);

  return (
    <>
      {/* Fixed App Bar */}
      <WebAppBar links={webAppBarLinks} fullWidth sx={{ backgroundColor: "transparent" }} />

      {/* Translucent App Bar, Last Element, On Top of All */}
      <WebAppBar
        links={webAppBarLinks}
        translucent={true}
        sx={{
          zIndex: 2,
          marginTop: "25px",
          position: "fixed",
          top: `${translucentAppBarTop}px`,
          left: "0px",
        }}
      />

      <Outlet />

      <Box sx={{ position: "relative" }}>
        <Footer />
      </Box>
    </>
  );
}

export default App;
