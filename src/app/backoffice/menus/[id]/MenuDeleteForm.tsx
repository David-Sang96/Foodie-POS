"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";
import { deleteMenu } from "../actions";

type Props = {
  id: string;
};

const MenuDeleteForm = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const response = await deleteMenu(Number(id));
    if (!response?.error) {
      toast.success("Deleted Successfully");
      router.push("/backoffice/menus");
    } else {
      toast.error(response.error);
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "end" }}
      component={"form"}
      onSubmit={handleDelete}
    >
      <Button
        variant="contained"
        sx={{ bgcolor: "chocolate" }}
        type="submit"
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete"}
      </Button>
    </Box>
  );
};

export default MenuDeleteForm;
