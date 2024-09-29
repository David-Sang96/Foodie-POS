import MenuCard from "@/components/MenuCard";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getMenus } from "./actions";

const MenusPage = async () => {
  const menus = await getMenus();

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
        {menus.map((menu) => (
          <MenuCard menu={menu} key={menu.id} />
        ))}
      </Box>
    </>
  );
};

export default MenusPage;
