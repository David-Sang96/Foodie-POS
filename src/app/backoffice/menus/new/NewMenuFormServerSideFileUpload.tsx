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
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { createMenuServer } from "../actions";

interface Props {
  menuCategories: MenuCategories[];
}

const NewMenuForm = ({ menuCategories }: Props) => {
  const [isLoading] = useState<boolean>(true);
  const router = useRouter();

  const clientAction = async (formData: FormData) => {
    const response = await createMenuServer(formData);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Menu Created Successfully");
      router.push("/backoffice/menus");
    }
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
          }}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default NewMenuForm;
