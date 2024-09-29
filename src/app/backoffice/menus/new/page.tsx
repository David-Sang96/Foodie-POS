import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { createMenu, getMenuCategories } from "../actions";

const NewMenuPage = async () => {
  const menuCategories = await getMenuCategories();

  return (
    <Box sx={{ width: "45%" }} component={"form"} action={createMenu}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 3,
        }}
      >
        <TextField label="name" variant="outlined" name="name" />
        <TextField label="price" variant="outlined" name="price" />

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
          }}
          type="submit"
        >
          Create
        </Button>
      </Box>
    </Box>
  );
};

export default NewMenuPage;
