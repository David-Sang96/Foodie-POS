"use client";

import { menuCategoryFormSchema } from "@/libs/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { createMenuCategory } from "../actions";

const newMenuCategoryData = menuCategoryFormSchema.omit({
  id: true,
  isAvailable: true,
  companyId: true,
});

type FormFields = z.infer<typeof newMenuCategoryData>;

const NewMenuCategoryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>({ resolver: zodResolver(newMenuCategoryData) });
  const router = useRouter();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const response = await createMenuCategory(data.name);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Created successfully");
      router.push("/backoffice/menu-categories");
      router.refresh();
    }
    setError("root", {
      message: "Something went wrong in form",
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "40%",
        mt: 2,
      }}
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={""}
        {...register("name")}
      />
      {errors.name && <Box sx={{ color: "red" }}>{errors.name.message}</Box>}
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
        {isSubmitting ? "creating..." : " Create"}
      </Button>
    </Box>
  );
};

export default NewMenuCategoryForm;
