import ItemCard from "@/components/ItemCard";
import CategoryIcon from "@mui/icons-material/Category";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getAddonCategories } from "./actions";

const AddonCategoryPage = async () => {
  const addonCategories = await getAddonCategories();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/addon-categories/new"}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          >
            New Addon Category
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {addonCategories.map((addonCategory) => (
          <ItemCard
            key={addonCategory.id}
            title={addonCategory.name}
            href={`/backoffice/addon-categories/${addonCategory.id}`}
            icon={<CategoryIcon fontSize="large" />}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
};

export default AddonCategoryPage;
