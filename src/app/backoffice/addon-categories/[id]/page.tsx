import { prisma } from "@/libs/prisma";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  deleteAddonCategory,
  getAddonCategory,
  updateAddonCategory,
} from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateAddonCategory = async ({ params }: Props) => {
  const { id } = params;
  const addonCategory = await getAddonCategory(Number(id));
  const menus = await prisma.menus.findMany();
  const menuIds = addonCategory.menusAddonCategories.map((item) => item.menuId);

  return (
    <Box>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteAddonCategory}
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
        action={updateAddonCategory}
      >
        <TextField
          label="name"
          variant="outlined"
          defaultValue={addonCategory.name}
          name="name"
        />
        <input type="hidden" value={id} name="id" />
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
                control={
                  <Checkbox
                    name="menu"
                    value={menu.id}
                    defaultChecked={menuIds.includes(menu.id)}
                  />
                }
                label={menu.name}
              />
            ))}
          </Box>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              name="isRequired"
              defaultChecked={!!addonCategory.isRequired}
            />
          }
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
          update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAddonCategory;
