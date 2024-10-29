import { Box, Button, TextField } from "@mui/material";
import { createLocation } from "../actions";

const NewLocationPage = () => {
  return (
    <Box
      component={"form"}
      action={createLocation}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        width: "40%",
        mt: 2,
      }}
    >
      <TextField placeholder="Name" label="Name" name="name" />
      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: "#1d3557",
          "&hover": { bgcolor: "#2d4466" },
          width: "fit-content",
        }}
      >
        Create
      </Button>
    </Box>
  );
};

export default NewLocationPage;
