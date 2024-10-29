"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type { MenuCategories } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import {
  deleteMenuCategory,
  getMenuCategory,
  updateMenuCategory,
} from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenuCategory = ({ params }: Props) => {
  const { id } = params;
  const [menuCategory, setMenuCategory] = useState<MenuCategories>();
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const formRef = useRef<HTMLFormElement>();

  useEffect(() => {
    handleGetMenuCategories();
  }, []);

  const handleGetMenuCategories = async () => {
    const data = await getMenuCategory(id);
    setMenuCategory(data);
    setIsAvailable(data.isAvailable ?? false);
  };

  const handleUpdate = () => {
    const fd = new FormData(formRef.current);
    const locationId = localStorage.getItem("current_location_id") as string;
    fd.set("locationId", locationId);
    updateMenuCategory(fd);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAvailable(event.target.checked);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteMenuCategory}
      >
        <input type="hidden" value={id} name="id" />
        <Button variant="contained" sx={{ bgcolor: "chocolate" }} type="submit">
          Delete
        </Button>
      </Box>
      <Box sx={{ width: "40%" }} component={"form"} ref={formRef}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            variant="outlined"
            defaultValue={menuCategory?.name}
            name="name"
          />
          <input type="hidden" value={id} name="id" />
          <FormControlLabel
            control={
              <Checkbox
                checked={!!isAvailable}
                onChange={handleCheckboxChange}
                name="isAvailable"
              />
            }
            label="Available"
          />
          <Button
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
              width: "fit-content",
            }}
            variant="contained"
            onClick={handleUpdate}
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default UpdateMenuCategory;
