import { getCompanyMenus } from "@/libs/actions";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { createAddonCategory } from "../actions";

const NewAddonCategory = async () => {
  const menus = await getCompanyMenus();

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
      action={createAddonCategory}
    >
      <TextField
        label="name"
        variant="outlined"
        defaultValue={""}
        name="name"
      />
      <Box>
        <Typography sx={{ my: 1, fontWeight: "bold" }}>Menus</Typography>
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
          {menus.map((menu) => (
            <FormControlLabel
              key={menu.id}
              control={<Checkbox name="menu" value={menu.id} />}
              label={menu.name}
            />
          ))}
        </Box>
      </Box>
      <FormControlLabel
        control={<Checkbox name="isRequired" defaultChecked />}
        label={"isRequired"}
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

export default NewAddonCategory;
