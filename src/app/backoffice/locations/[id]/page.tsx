import { getSelectedLocation } from "@/libs/actions";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { deleteLocation, getLocation, updateLocation } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateLocationPage = async ({ params }: Props) => {
  const { id } = params;
  const location = await getLocation(Number(id));
  const selectedLocation = await getSelectedLocation();
  const isSelected = Number(id) === selectedLocation?.locationId;

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteLocation}
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
        action={updateLocation}
      >
        <TextField
          label="name"
          variant="outlined"
          defaultValue={location.name}
          name="name"
        />
        <input type="hidden" name="id" value={id} />
        <FormControlLabel
          control={<Checkbox defaultChecked={isSelected} name="isSelected" />}
          label="Current Location"
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
          update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateLocationPage;
