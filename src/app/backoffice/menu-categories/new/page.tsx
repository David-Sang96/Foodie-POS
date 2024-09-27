import { Box, Button, TextField } from "@mui/material";
import { createMenuCategory } from "../actions";

const NewMenuCategoryPage = async () => {
  return (
    <Box sx={{ width: "40%" }} component={"form"} action={createMenuCategory}>
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
          defaultValue={""}
          name="menuCategoryName"
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

export default NewMenuCategoryPage;
