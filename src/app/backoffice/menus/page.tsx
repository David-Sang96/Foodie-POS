import MenuCard from "@/components/MenuCard";
import { getCompanyMenus, getSelectedLocation } from "@/libs/actions";
import { Box, Button } from "@mui/material";
import Link from "next/link";

const MenusPage = async () => {
  const menus = await getCompanyMenus();
  const selectedLocation = (await getSelectedLocation())?.locationId;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/menus/new"}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          >
            New Menu
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {menus.map((menu) => {
          const isAvailable = !menu.disabledLocationMenus.find(
            (item) =>
              item.menuId === menu.id && item.locationId === selectedLocation
          );
          return (
            <MenuCard
              menu={menu}
              key={menu.id}
              isAvailable={isAvailable}
              showIsAvailable
              relatedUrl={`/backoffice/menus/${menu.id}`}
            />
          );
        })}
      </Box>
    </>
  );
};

export default MenusPage;
