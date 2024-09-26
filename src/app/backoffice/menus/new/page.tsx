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
import { MenuCategories, Menus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const NewMenuPage = () => {
  const defaultMenu = { name: "", price: 0, isAvailable: true };
  const [newMenu, setNewMenu] = useState<Partial<Menus>>(defaultMenu);
  const [menuCategories, setMenuCategories] = useState<MenuCategories[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const getMenuCategories = async () => {
      const response = await fetch(
        `${config.backofficeApiUrl}/menu-categories`
      );
      const data = await response.json();
      setMenuCategories(data);
    };

    getMenuCategories();
  }, []);

  const handleCreateMenu = async () => {
    if (!newMenu.name || newMenu.price === 0)
      return toast.error("Please fill up all fields");
    if (selected.length === 0)
      return toast.error("please choose one menuCategory");
    await fetch(`${config.backofficeApiUrl}/menus`, {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ ...newMenu, menuCategoryIds: selected }),
    });
    setNewMenu(defaultMenu);
    toast.success("Menu created");
    router.push("/backoffice/menus");
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
            defaultValue={newMenu.name}
            onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
          />
          <TextField
            label="price"
            variant="outlined"
            defaultValue={newMenu.price}
            onChange={(e) =>
              setNewMenu({ ...newMenu, price: Number(e.target.value) })
            }
          />
          <MultiSelect
            items={menuCategories}
            title="MenuCategories"
            selected={selected}
            setSelected={setSelected}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Available"
            value={newMenu.isAvailable}
            onChange={(_, value) =>
              setNewMenu({ ...newMenu, isAvailable: value })
            }
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
              width: "fit-content",
            }}
            onClick={handleCreateMenu}
          >
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default NewMenuPage;
