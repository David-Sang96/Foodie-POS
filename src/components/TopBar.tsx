import { getCompanyLocations } from "@/libs/actions";
import Box from "@mui/material/Box";
import LocationSignOut from "./LocationSignOut";

const TopBar = async () => {
  const locations = await getCompanyLocations();

  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#e63946",
        color: "#f1faee",
        height: "65px",
        alignItems: "center",
        paddingInline: "20px",
      }}
    >
      <h2>Foodie POS</h2>
      <LocationSignOut locations={locations} />
    </Box>
  );
};

export default TopBar;
