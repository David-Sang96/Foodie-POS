import QrImage from "@/components/QrImage";
import { Box, Button, TextField } from "@mui/material";
import { deleteTable, getTable, updateTable } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateTable = async ({ params }: Props) => {
  const { id } = params;

  const table = await getTable(Number(id));

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteTable}
      >
        <input type="hidden" value={id} name="id" />
        <Button variant="contained" sx={{ bgcolor: "chocolate" }} type="submit">
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          width: "40%",
        }}
        component={"form"}
        action={updateTable}
      >
        <TextField
          label="name"
          variant="outlined"
          defaultValue={table.name}
          name="name"
        />
        <input type="hidden" name="id" value={id} />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1d3557",
            "&hover": { bgcolor: "#2d4466" },
            width: "fit-content",
          }}
          type="submit"
        >
          update
        </Button>
        <QrImage qrImageUrl={table.qrCodeImageUrl} />
      </Box>
    </Box>
  );
};

export default UpdateTable;
