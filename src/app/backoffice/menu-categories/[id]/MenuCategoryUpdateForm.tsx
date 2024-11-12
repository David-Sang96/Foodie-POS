"use client";

import { menuCategoryFormSchema } from "@/libs/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import type { MenuCategories } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { updateMenuCategory } from "../actions";

export interface Props {
  menuCategory: MenuCategories;
  isAvailable: boolean;
  id: string;
}

const menuCategoryData = menuCategoryFormSchema.omit({
  companyId: true,
  id: true,
});

type FormFields = z.infer<typeof menuCategoryData>;

const MenuCategoryUpdateForm = ({ menuCategory, isAvailable, id }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>({
    resolver: zodResolver(menuCategoryData),
  });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { name, isAvailable } = data;
    const response = await updateMenuCategory({
      id: Number(id),
      isAvailable,
      name,
    });
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Updated successfully");
      router.push("/backoffice/menu-categories");
      router.refresh();
    }
    setError("root", { message: "Something went wrong in form" });
  };

  return (
    <Box
      sx={{ width: "40%" }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          defaultValue={menuCategory?.name}
          {...register("name")}
        />
        {errors.name && <Box sx={{ color: "red" }}>{errors.name.message}</Box>}
        <FormControlLabel
          control={<Checkbox defaultChecked={isAvailable} name="isAvailable" />}
          label="Available"
          {...register("isAvailable")}
        />
        <Button
          sx={{
            bgcolor: "#1D3557",
            "&:hover": { bgcolor: "#2d4466" },
            width: "fit-content",
          }}
          variant="contained"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update"}
        </Button>
      </Box>
      {errors.name && <Box sx={{ color: "red" }}>{errors.root?.message}</Box>}
    </Box>
  );
};

export default MenuCategoryUpdateForm;
