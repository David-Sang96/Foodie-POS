import { Box, Button, TextField } from "@mui/material";
import { createTable } from "../actions";

const NewTable = () => {
  // const formRef = useRef<HTMLFormElement>();

  // const handleCreateTable = () => {
  //   const fd = new FormData(formRef.current);
  //   const locationId = localStorage.getItem("current_location_id") as string;
  //   fd.append("locationId", locationId);
  //   createTable(fd);
  // };

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
        autoFocus
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
