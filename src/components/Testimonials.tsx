"use client";

import { Avatar, Box, Paper, Typography } from "@mui/material";
import Image from "next/image";
import { useInView } from "react-intersection-observer";

const testimonials = [
  {
    name: "Tom",
    company: "Tasty Foods Co. Ltd",
    avatar: "/pic1.jpeg",
    description: `We increased our sale by 120% during the first 3 months of using Foodie POS. Easy and simple to use. 
      Super duper recommended for everyone who are less tech savy. 5/5`,
  },
  {
    name: "Hailey",
    company: "Waa T Co. Ltd",
    avatar: "/pic2.jpeg",
    description: `Our customers love Foodie POS. Quick and easy with QR code ordering. We now spend more time taking 
      care of our customers instead of taking orders manually. Thanks to Foodie POS!`,
  },
  {
    name: "Zen",
    company: "Swey Mel Co. Ltd",
    avatar: "/pic3.jpeg",
    description: `Integrated system. Easy to use. Very satisfied. Highly recommended for everyone. 
    Foodie POS customer service is a top-notch! They are always there when we need help. 5 starsss!`,
  },
];

const Testimonials = () => {
  const { ref, inView } = useInView({
    // triggerOnce: true,
    threshold: 0.1, // Element must be 10% visible
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        mt: 5,
        minHeight: 350,
        flexWrap: "wrap",
      }}
    >
      {testimonials.map((item) => (
        <Box ref={ref} key={item.name}>
          <Paper
            sx={{
              width: 300,
              height: 230,
              p: 2,
              borderRadius: 3,
              bgcolor: "#1B9C85",
              transform: inView ? "translateY(0)" : "translateY(200px)",
              opacity: inView ? 1 : 0,
              transition: "all 2s ease-in-out", // Smooth transition
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Avatar alt={item.name} sx={{ mr: 2 }}>
                <Image src={item.avatar} alt={item.name} fill />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#E8F6EF",
                  }}
                >
                  {item.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontStyle: "italic",
                    color: "#E8F6EF",
                  }}
                >
                  {item.company}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontSize: "16px", color: "#E8F6EF" }}
            >
              {item.description}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
};

export default Testimonials;
