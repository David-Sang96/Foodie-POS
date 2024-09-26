"use client";

import ItemCard from "@/components/ItemCard";
import { config } from "@/config";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import { MenuCategories } from "@prisma/client";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

const MenuCategoriesPage = () => {
  const [menuCategories, setMenuCategories] = useState<MenuCategories[]>([]);
  const router = useRouter();

  const getMenuCategories = async () => {
    const res = await fetch(`${config.backofficeApiUrl}/menu-categories`);
    const data = await res.json();
    setMenuCategories(data);
  };

  useEffect(() => {
    getMenuCategories();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          onClick={() => router.push("/backoffice/menu-categories/new")}
        >
          New Menu Category
        </Button>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {menuCategories.map((menuCategory) => (
          <ItemCard
            title={menuCategory.name}
            key={menuCategory.id}
            icon={<CategoryIcon fontSize="large" />}
            href={`/backoffice/menu-categories/${menuCategory.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
};

export default MenuCategoriesPage;
