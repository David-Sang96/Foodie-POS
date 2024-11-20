"use client";

import type { MenuCategoryType } from "@/app/order/page";
import { Box, Tab, Tabs } from "@mui/material";
import type { Menus } from "@prisma/client";
import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";

interface Props {
  menuCategories: MenuCategoryType[];
  menus: Menus[];
  tableId: string;
}

const MenuCategoryTab = ({ menuCategories, menus, tableId }: Props) => {
  const [value, setValue] = useState(0);
  const [menusToShow, setMenusToShow] = useState<Menus[]>([]);
  const [selectedMenuCategory, setSelectedMenuCategory] =
    useState<MenuCategoryType>(menuCategories[0]);

  useEffect(() => {
    const menuIds = selectedMenuCategory.menuCategoriesMenus.map(
      (item) => item.menuId
    );
    const getRelatedMenus = menus.filter((item) => menuIds.includes(item.id));
    setMenusToShow(getRelatedMenus);
  }, [selectedMenuCategory]);

  return (
    <Box
      sx={{
        position: "relative",
        top: { md: -10, lg: -240 },
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Tabs
        TabIndicatorProps={{
          style: { background: "#457b9d" },
        }}
        value={value}
        onChange={(_, value) => setValue(value)}
        variant="scrollable"
        sx={{
          pb: 1,
          "& .MuiTab-root.Mui-selected": {
            color: "#457b9d",
            fontWeight: "bold",
          },
        }}
      >
        {menuCategories.map((menuCategory, index) => (
          <Tab
            key={menuCategory.id}
            label={menuCategory.name}
            value={index}
            onClick={() => setSelectedMenuCategory(menuCategory)}
          />
        ))}
      </Tabs>
      <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {menusToShow.map((menu) => {
          return (
            <MenuCard
              menu={menu}
              showIsAvailable={false}
              key={menu.id}
              relatedUrl={`/order/menus/${menu.id}?tableId=${tableId}`}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default MenuCategoryTab;
