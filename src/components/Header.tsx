import { Box, Slide, Typography } from "@mui/material";
import Image from "next/image";

const Header = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "fixed",
        top: 0,
      }}
    >
      <Image
        src="/header.svg"
        alt="header-image"
        width={0}
        height={0}
        style={{ width: "100%", height: "auto" }}
      />
      <Slide
        direction="left"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={2000}
      >
        <Box
          sx={{
            position: "absolute",
            right: 0,
            display: { xs: "none", md: "block" },
          }}
        >
          <Image
            src={"/panda-cooking.png"}
            alt="header-image"
            width={350}
            height={350}
          />
        </Box>
      </Slide>
      <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={2000}
      >
        <Typography
          variant="h2"
          sx={{
            position: "absolute",
            fontWeight: "bold",
            color: "#4C4C6D",
            mt: 6,
          }}
        >
          Foodie POS
        </Typography>
      </Slide>
    </Box>
  );
};

export default Header;
