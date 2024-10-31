import { getSelectedLocation } from "@/libs/actions";
import Box from "@mui/material/Box";
import SignOutButton from "./SignOutButton";

const TopBar = async () => {
  const selectedLocation = await getSelectedLocation();

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
      <h3>{selectedLocation?.locations.name}</h3>
      <SignOutButton />
    </Box>
  );
};

export default TopBar;
