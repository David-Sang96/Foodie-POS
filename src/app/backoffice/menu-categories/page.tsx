import ItemCard from "@/components/ItemCard";
import { getCompanyMenuCategories, getSelectedLocation } from "@/libs/actions";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import Link from "next/link";

const MenuCategoriesPage = async () => {
  const menuCategories = await getCompanyMenuCategories();
  const locationId = (await getSelectedLocation())?.locationId;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/menu-categories/new"}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          >
            New Menu Category
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {menuCategories.map((menuCategory) => {
          const isAvailable = menuCategory.disabledLocationMenuCategories.find(
            (item) =>
              item.menuCategoryId === menuCategory.id &&
              item.locationId === locationId &&
              item.isArchived === false
          );
          return (
            <ItemCard
              title={menuCategory.name}
              key={menuCategory.id}
              icon={<CategoryIcon fontSize="large" />}
              href={`/backoffice/menu-categories/${menuCategory.id}`}
              isAvailable={!isAvailable}
            />
          );
        })}
      </Box>
    </>
  );
};

export default MenuCategoriesPage;
