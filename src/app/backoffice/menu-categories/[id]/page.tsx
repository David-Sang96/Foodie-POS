import { getSelectedLocation } from "@/libs/actions";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import {
  deleteMenuCategory,
  getMenuCategory,
  updateMenuCategory,
} from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenuCategory = async ({ params }: Props) => {
  const { id } = params;
  const menuCategory = await getMenuCategory(id);
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const isAvailable = !menuCategory.disabledLocationMenuCategories.find(
    (item) =>
      item.menuCategoryId === Number(id) && item.locationId === selectedLocation
  );

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteMenuCategory}
      >
        <input type="hidden" value={id} name="id" />
        <Button variant="contained" sx={{ bgcolor: "chocolate" }} type="submit">
          Delete
        </Button>
      </Box>
      <Box sx={{ width: "40%" }} component={"form"} action={updateMenuCategory}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            variant="outlined"
            defaultValue={menuCategory?.name}
            name="name"
          />
          <input type="hidden" value={id} name="id" />
          <FormControlLabel
            control={
              <Checkbox defaultChecked={isAvailable} name="isAvailable" />
            }
            label="Available"
          />
          <Button
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
              width: "fit-content",
            }}
            variant="contained"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default UpdateMenuCategory;
