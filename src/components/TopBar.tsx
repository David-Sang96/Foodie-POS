"use client";

import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import { signOut } from "next-auth/react";

const TopBar = () => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#e63946",
        color: "#f1faee",
        height: "65px",
        alignItems: "center",
        paddingInline: "20px",
      }}
    >
      <h2>Foodie POS</h2>
      <h3>Sanchaung</h3>
      <Button
        variant="contained"
        sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </Box>
  );
};

export default TopBar;
