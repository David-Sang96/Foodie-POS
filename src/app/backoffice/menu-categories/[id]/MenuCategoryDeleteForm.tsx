"use client";

import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { deleteMenuCategory } from "../actions";

interface Props {
  id: string;
}

const MenuCategoryDeleteForm = ({ id }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const response = await deleteMenuCategory(Number(id));
    if (response?.error) {
      toast.error(response?.error);
    } else {
      toast.success("Deleted successfully");
      router.push("/backoffice/menu-categories");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{ display: "flex", justifyContent: "end" }}
      component={"form"}
      action={handleDelete}
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

export default MenuCategoryDeleteForm;
