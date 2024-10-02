"use client";

import GoogleIcon from "@mui/icons-material/Google";
import { Box, Button, Typography } from "@mui/material";
import { signIn } from "next-auth/react";

const SignIn = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        bgcolor: "#f1faee",
        display: "flex",
        pt: 30,
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Typography variant="h2">Welcome back!</Typography>
      <Typography sx={{ textAlign: "center", mb: 3, maxWidth: 400 }}>
        Sign in to your account to access your backoffice and manage your menus.
      </Typography>
      <Button
        sx={{
          bgcolor: "#103557",
          color: "#fff",
          "&:hover": { bgcolor: "#457b9D" },
        }}
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
      >
        Sign in with google
      </Button>
    </Box>
  );
};

export default SignIn;
