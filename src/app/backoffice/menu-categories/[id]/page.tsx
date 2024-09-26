"use client";

import { config } from "@/config";
import { Box, Button, TextField } from "@mui/material";
import { MenuCategories } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenuCategory = ({ params }: Props) => {
  const [menuCategory, setMenuCategory] = useState<MenuCategories>();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const getMenuCategory = async () => {
      const response = await fetch(
        `${config.backofficeApiUrl}/menu-categories/${id}`
      );
      const data = await response.json();
      setMenuCategory(data);
    };

    getMenuCategory();
  }, [id]);

  const handleUpdateMenuCategory = async () => {
    await fetch(`${config.backofficeApiUrl}/menu-categories`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(menuCategory),
    });

    router.push("/backoffice/menu-categories");
  };

  const handleDeleteMenuCategory = async () => {
    await fetch(`${config.backofficeApiUrl}/menu-categories/${id}`, {
      method: "delete",
    });

    router.push("/backoffice/menu-categories");
  };

  if (!menuCategory) return null;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "chocolate" }}
          onClick={handleDeleteMenuCategory}
        >
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 3,
        }}
      >
        <TextField
          // label="name"
          variant="outlined"
          value={menuCategory.name}
          onChange={(e) =>
            setMenuCategory({ ...menuCategory, name: e.target.value })
          }
        />

        <Button
          variant="contained"
          sx={{ width: "fit-content" }}
          onClick={handleUpdateMenuCategory}
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default UpdateMenuCategory;
