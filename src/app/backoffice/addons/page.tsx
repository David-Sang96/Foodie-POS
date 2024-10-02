import ItemCard from "@/components/ItemCard";
import EggIcon from "@mui/icons-material/Egg";
import { Box, Button } from "@mui/material";
import Link from "next/link";
import { getAddons } from "./actions";

const AddonsPage = async () => {
  const addons = await getAddons();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/addons/new"}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          >
            New Addon
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {addons.map((addon) => (
          <ItemCard
            icon={<EggIcon />}
            key={addon.id}
            title={addon.name}
            subtitle={String(addon.price)}
            href={`/backoffice/addons/${addon.id}`}
            isAvailable={!!addon.isAvailable}
          />
        ))}
      </Box>
    </>
  );
};

export default AddonsPage;
