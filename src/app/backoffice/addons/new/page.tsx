import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { createAddon, getAddonCategories } from "../actions";

const NewAddon = async () => {
  const addonCategories = await getAddonCategories();

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
      action={createAddon}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={""}
        name="name"
      />
      <TextField
        label="price"
        variant="outlined"
        defaultValue={""}
        name="price"
      />
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
                <Checkbox name="addonCategoryId" value={addonCategory.id} />
              }
              label={addonCategory.name}
            />
          ))}
        </Box>
      </Box>
      <FormControlLabel
        control={<Checkbox name="isAvailable" defaultChecked />}
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
        Create
      </Button>
    </Box>
  );
};

export default NewAddon;
