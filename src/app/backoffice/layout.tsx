import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const BackOfficeLayout = ({ children }: Props) => {
  return (
    <Box>
      <TopBar />
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <SideBar />
        <Box sx={{ p: 2, flex: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default BackOfficeLayout;
