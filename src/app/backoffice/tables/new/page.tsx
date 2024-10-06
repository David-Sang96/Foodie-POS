import { Box, Button, TextField } from "@mui/material";
import { createTable } from "../actions";

const NewTable = async () => {
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
      action={createTable}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={""}
        name="name"
      />

      <Button
        variant="contained"
        sx={{
          bgcolor: "#1d3557",
          "&hover": { bgcolor: "#2d4466" },
          width: "fit-content",
        }}
        type="submit"
      >
        Create
      </Button>
    </Box>
  );
};

export default NewTable;
