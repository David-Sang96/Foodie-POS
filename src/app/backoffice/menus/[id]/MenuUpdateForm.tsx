"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import type { AddonCategories, MenuCategories, Menus } from "@prisma/client";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateMenu } from "../actions";

interface Props {
  id: string;
  menu: Menus;
  menuCategories: MenuCategories[];
  selectedMenuCategoryIds: number[];
  addonCategories: AddonCategories[];
  selectedAddonCategoryIds: number[];
  isAvailable: boolean;
}

const MenuUpdateForm = ({
  id,
  menu,
  menuCategories,
  selectedMenuCategoryIds,
  addonCategories,
  selectedAddonCategoryIds,
  isAvailable,
}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    const file = formData.get("file") as File;
    if (file && file.size) {
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      formData.set("imageUrl", url);
    }
    const response = await updateMenu(formData);
    if (response?.error) {
      response.error.forEach((item) => toast.error(item.message));
    } else {
      toast.success("Updated Successfully");
      router.push("/backoffice/menus");
    }
    setIsSubmitting(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        mt: 3,
        width: "40%",
      }}
      component={"form"}
      action={handleSubmit}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={menu.name}
        name="name"
      />
      <TextField
        label="price"
        variant="outlined"
        defaultValue={menu.price}
        name="price"
        type="number"
      />
      <input type="hidden" name="id" value={id} />
      <Box>
        <Typography sx={{ my: 1, fontWeight: "bold" }}>
          MenuCategories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            border: " 1px solid lightgray",
            px: 2,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {menuCategories.map((menuCategory) => (
            <FormControlLabel
              key={menuCategory.id}
              control={
                <Checkbox
                  defaultChecked={selectedMenuCategoryIds.includes(
                    menuCategory.id
                  )}
                  value={menuCategory.id}
                  name="menuCategoryIds"
                />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
      </Box>
      <Box>
        <Typography sx={{ my: 1, fontWeight: "bold" }}>
          AddonCategories
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            border: " 1px solid lightgray",
            px: 2,
            py: 0.5,
            borderRadius: 1,
          }}
        >
          {addonCategories.map((addonCategory) => (
            <FormControlLabel
              key={addonCategory.id}
              control={
                <Checkbox
                  defaultChecked={selectedAddonCategoryIds.includes(
                    addonCategory.id
                  )}
                  value={addonCategory.id}
                  name="addonCategoryIds"
                />
              }
              label={addonCategory.name}
            />
          ))}
        </Box>
      </Box>
      <Image
        src={menu.imageUrl || ""}
        alt="menu image"
        width={200}
        height={200}
        style={{ margin: "auto", marginBlock: "10px" }}
      />
      <TextField
        type="file"
        name="file"
        inputProps={{ accept: "image/jpeg, image/png, image/webp" }}
      />

      <FormControlLabel
        control={<Checkbox defaultChecked={isAvailable} name="isAvailable" />}
        label="Available"
      />
      <Button
        variant="contained"
        sx={{
          bgcolor: "#1D3557",
          "&:hover": { bgcolor: "#2d4466" },
          width: "fit-content",
        }}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Updating..." : "Update"}
      </Button>
    </Box>
  );
};

export default MenuUpdateForm;
