import { getCompanyMenuCategories } from "@/libs/actions";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { deleteMenu, getMenu, updateMenu } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenu = async ({ params }: Props) => {
  const { id } = params;

  const menu = await getMenu(Number(id));
  const menuCategories = await getCompanyMenuCategories();

  const menuCategoryIds = menu.menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteMenu}
      >
        <input type="hidden" name="id" value={id} />
        <Button variant="contained" sx={{ bgcolor: "chocolate" }} type="submit">
          Delete
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          mt: 3,
          width: "40%",
        }}
        component={"form"}
        action={updateMenu}
      >
        <TextField
          label="name"
          variant="outlined"
          defaultValue={menu.name}
          name="name"
        />
        <TextField
          label="price"
          variant="outlined"
          defaultValue={menu.price}
          name="price"
        />
        <input type="hidden" name="id" value={id} />
        <Box>
          <Typography sx={{ my: 1, fontWeight: "bold" }}>
            MenuCategories
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
            {menuCategories.map((menuCategory) => (
              <FormControlLabel
                key={menuCategory.id}
                control={
                  <Checkbox
                    defaultChecked={menuCategoryIds?.includes(menuCategory.id)}
                    name="menuCategory"
                    value={menuCategory.id}
                  />
                }
                label={menuCategory.name}
              />
            ))}
          </Box>
        </Box>

        <FormControlLabel
          control={
            <Checkbox defaultChecked={!!menu.isAvailable} name="isAvailable" />
          }
          label="Available"
        />
        <Button
          variant="contained"
          sx={{
            bgcolor: "#1D3557",
            "&:hover": { bgcolor: "#2d4466" },
            width: "fit-content",
          }}
          type="submit"
        >
          Update
        </Button>
      </Box>
    </>
  );
};

export default UpdateMenu;
