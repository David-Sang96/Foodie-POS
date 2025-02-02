import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import { Box } from "@mui/material";

export default function FoodiePOS() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        flexDirection: "column",
      }}
    >
      <Header />
      <Box
        sx={{
          maxWidth: { md: "100%", lg: "1280px" },
          m: "0 auto",
          px: { xs: "10px", md: "15px" },
          flex: 1,
        }}
      >
        <Hero />
        <Features />
        <Testimonials />
      </Box>
      <Footer />
    </Box>
  );
}
