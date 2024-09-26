"use client";

import MultiSelect from "@/components/MultiSelect";
import { config } from "@/config";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { MenuCategories, MenuCategoriesMenus, Menus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenu = ({ params }: Props) => {
  const [menu, setMenu] = useState<Menus>();
  const [menuCategories, setMenuCategories] = useState<MenuCategories[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    getMenu();
    getMenuCategories();
  }, [id]);

  const getMenu = async () => {
    const response = await fetch(`${config.backofficeApiUrl}/menus/${id}`);
    const data = await response.json();
    const menuCategoryIds = data.menuCategoriesMenus.map(
      (item: MenuCategoriesMenus) => item.menuCategoryId
    );
    setSelected(menuCategoryIds);
    setMenu(data);
  };

  const getMenuCategories = async () => {
    const response = await fetch(`${config.backofficeApiUrl}/menu-categories`);
    const data = await response.json();
    setMenuCategories(data);
  };

  const handleUpdateMenu = async () => {
    await fetch(`${config.backofficeApiUrl}/menus`, {
      method: "put",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...menu, menuCategoryIds: selected }),
    });

    router.push("/backoffice/menus");
  };

  const handleDeleteMenu = async () => {
    await fetch(`${config.backofficeApiUrl}/menus/${id}`, {
      method: "delete",
    });

    router.push("/backoffice/menus");
  };

  if (!menu) return null;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "chocolate" }}
          onClick={handleDeleteMenu}
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
          label="name"
          variant="outlined"
          defaultValue={menu.name}
          onChange={(e) => setMenu({ ...menu, name: e.target.value })}
        />
        <TextField
          label="price"
          variant="outlined"
          defaultValue={menu.price}
          onChange={(e) => setMenu({ ...menu, price: Number(e.target.value) })}
        />
        <MultiSelect
          items={menuCategories}
          title="MenuCategories"
          selected={selected}
          setSelected={setSelected}
        />
        <FormControlLabel
          control={
            <Checkbox defaultChecked={menu.isAvailable ? true : false} />
          }
          label="Available"
          value={menu.isAvailable}
          onChange={(_, value) => setMenu({ ...menu, isAvailable: value })}
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1D3557",
            "&:hover": { bgcolor: "#2d4466" },
            width: "fit-content",
          }}
          onClick={handleUpdateMenu}
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default UpdateMenu;
