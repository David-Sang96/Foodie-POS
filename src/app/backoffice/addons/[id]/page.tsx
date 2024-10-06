import { getCompanyAddonCategories } from "@/libs/actions";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { deleteAddon, getAddon, updateAddon } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateAddon = async ({ params }: Props) => {
  const { id } = params;

  const addon = await getAddon(Number(id));
  const addonCategories = await getCompanyAddonCategories();

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteAddon}
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
        action={updateAddon}
      >
        <TextField
          label="name"
          variant="outlined"
          defaultValue={addon.name}
          name="name"
        />
        <TextField
          label="price"
          variant="outlined"
          defaultValue={addon.price}
          name="price"
        />
        <input type="hidden" value={id} name="id" />
        <Box>
          <Typography sx={{ my: 1, fontWeight: "bold" }}>
            Addon Categories
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
            {addonCategories.map((addonCategory) => (
              <FormControlLabel
                key={addonCategory.id}
                control={
                  <Checkbox
                    name="addonCategoryId"
                    value={addonCategory.id}
                    defaultChecked={addon.addonCategoryId === addonCategory.id}
                  />
                }
                label={addonCategory.name}
              />
            ))}
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Checkbox name="isAvailable" defaultChecked={addon.isAvailable} />
          }
          label={"isAvailable"}
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

export default UpdateAddon;
