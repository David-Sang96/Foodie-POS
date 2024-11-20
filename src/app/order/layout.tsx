import { Box } from "@mui/material";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return <Box sx={{ bgcolor: "#f1faee", minHeight: "100dvh" }}>{children}</Box>;
};

export default OrderLayout;
