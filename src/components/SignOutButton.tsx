"use client";

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <>
      <Button
        variant="contained"
        sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </>
  );
};

export default SignOutButton;
