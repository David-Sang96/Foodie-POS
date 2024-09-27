import { prisma } from "@/libs/prisma";
import { Box, Button, TextField } from "@mui/material";
import { deleteMenuCategory, updateMenuCategory } from "../actions";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenuCategory = async ({ params }: Props) => {
  const { id } = params;
  const menuCategory = await prisma.menuCategories.findFirst({
    where: { id: Number(id) },
  });

  return (
    <>
      <Box
        sx={{ display: "flex", justifyContent: "end" }}
        component={"form"}
        action={deleteMenuCategory}
      >
        <input type="hidden" value={id} name="menuCategoryId" />
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
            label="name"
            variant="outlined"
            defaultValue={menuCategory?.name}
            name="menuCategoryName"
          />
          <input type="hidden" value={id} name="menuCategoryId" />
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
