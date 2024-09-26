"use client";

import { config } from "@/config";
import { Box, Button, TextField } from "@mui/material";
import { MenuCategories } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NewMenuCategoryPage = () => {
  const defaultMenuCategory = { name: "" };
  const [newMenuCategory, setNewMenuCategory] =
    useState<Partial<MenuCategories>>(defaultMenuCategory);
  const router = useRouter();

  const handleCreateMenuCategory = async () => {
    if (!newMenuCategory.name) return alert("Name is required");
    await fetch(`${config.backofficeApiUrl}/menu-categories`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(newMenuCategory),
    });
    setNewMenuCategory(defaultMenuCategory);
    router.push("/backoffice/menu-categories");
  };

  return (
    <>
      <Box sx={{ width: "40%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: 3,
          }}
        >
          <TextField
            label="name"
            variant="outlined"
            defaultValue={newMenuCategory.name}
            onChange={(e) => setNewMenuCategory({ name: e.target.value })}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
              width: "fit-content",
            }}
            onClick={handleCreateMenuCategory}
          >
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NewMenuCategoryPage;
