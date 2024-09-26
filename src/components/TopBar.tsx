import Box from "@mui/material/Box";

const TopBar = () => {
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
      <h3>Sanchaung</h3>
      <Box style={{ cursor: "pointer", fontSize: "21px" }}>Logout</Box>
    </Box>
  );
};

export default TopBar;
