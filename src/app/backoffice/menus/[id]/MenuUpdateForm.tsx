"use client";

import { menuFormSchema } from "@/libs/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import type { MenuCategories, Menus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateMenu } from "../actions";

interface Props {
  id: string;
  menu: Menus;
  menuCategories: MenuCategories[];
  isAvailable: boolean;
  menuCategoryIds: number[];
}

const updateMenuData = menuFormSchema.omit({
  imageUrl: true,
  id: true,
});

type FormFields = z.infer<typeof updateMenuData>;

const MenuUpdateForm = ({
  menu,
  menuCategories,
  isAvailable,
  id,
  menuCategoryIds,
}: Props) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(menuCategoryIds);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(updateMenuData),
    defaultValues: {
      menuCategoryIds,
    },
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { name, isAvailable, price } = data;
    const response = await updateMenu({
      menuId: Number(id),
      menuPrice: price,
      isAvailable,
      menuName: name,
      menuCategoryIds: selectedIds,
    });
    if (!response.error) {
      toast.success("Updated Successfully");
      router.push("/backoffice/menus");
      router.refresh();
    } else {
      toast.error(response.error);
    }
    setError("root", {
      message: "Something went wrong in form",
    });
  };

  const onChangeHandler = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
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
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={menu.name}
        {...register("name")}
      />
      {errors.name && <Box sx={{ color: "red" }}>{errors.name.message}</Box>}
      <TextField
        label="price"
        variant="outlined"
        defaultValue={menu.price}
        {...register("price", { valueAsNumber: true })}
      />
      {errors.price && <Box sx={{ color: "red" }}>{errors.price?.message}</Box>}
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
                  checked={selectedIds.includes(menuCategory.id)}
                  onChange={() => onChangeHandler(menuCategory.id)}
                  value={menuCategory.id}
                />
              }
              label={menuCategory.name}
            />
          ))}
        </Box>
        {errors.menuCategoryIds && (
          <Box sx={{ color: "red" }}>{errors.menuCategoryIds.message}</Box>
        )}
      </Box>

      <FormControlLabel
        control={
          <Checkbox defaultChecked={isAvailable} {...register("isAvailable")} />
        }
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
      {errors.name && <Box sx={{ color: "red" }}>{errors.root?.message}</Box>}
    </Box>
  );
};

export default MenuUpdateForm;
