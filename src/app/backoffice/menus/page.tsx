"use client";

import MenuCard from "@/components/MenuCard";
import { config } from "@/config";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

export interface Menu {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
}
const Menus = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const router = useRouter();

  const getMenus = async () => {
    const res = await fetch(`${config.backofficeApiUrl}/menus`);
    const data = await res.json();
    setMenus(data);
  };

  useEffect(() => {
    getMenus();
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
          onClick={() => router.push("/backoffice/menus/new")}
        >
          New Menu
        </Button>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {menus.map((menu) => (
          <MenuCard menu={menu} key={menu.id} />
        ))}
      </Box>
    </>
  );
};

export default Menus;
