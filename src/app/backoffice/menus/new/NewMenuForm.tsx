"use client";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import { MenuCategories } from "@prisma/client";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createMenuClient } from "../actions";

interface Props {
  menuCategories: MenuCategories[];
}

const NewMenuForm = ({ menuCategories }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    const file = formData.get("file") as File;
    if (file && file.size) {
      const { url } = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      formData.set("imageUrl", url);
    }
    const response = await createMenuClient(formData);
    if (response.errors) {
      response.errors.forEach((item) => toast.error(item.message));
    } else {
      toast.success("Menu Created Successfully");
      router.push("/backoffice/menus");
      router.refresh();
    }
    setIsLoading(false);
  };

  return (
    <Box sx={{ width: "45%" }} component={"form"} action={clientAction}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 2,
        }}
      >
        <TextField label="name" variant="outlined" name="name" />
        <TextField
          label="price"
          variant="outlined"
          name="price"
          type="number"
        />

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
                  <Checkbox name="menuCategory" value={menuCategory.id} />
                }
                label={menuCategory.name}
              />
            ))}
          </Box>
        </Box>
        <TextField type="file" name="file" />

        <FormControlLabel
          control={<Checkbox defaultChecked name="isAvailable" />}
          label="Available"
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1D3557",
            "&:hover": { bgcolor: "#2d4466" },
            width: "fit-content",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <CircularProgress size={20} sx={{ color: "gray" }} />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default NewMenuForm;
