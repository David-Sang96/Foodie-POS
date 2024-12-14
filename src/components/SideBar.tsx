"use client";

import CategoryIcon from "@mui/icons-material/Category";
import ClassIcon from "@mui/icons-material/Class";
import EggIcon from "@mui/icons-material/Egg";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SettingsIcon from "@mui/icons-material/Settings";
import TableBarIcon from "@mui/icons-material/TableBar";

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface SideBarItemTypes {
  id: number;
  label: string;
  icon: ReactNode;
  route: string;
}

const SideBar = () => {
  const pathName = usePathname();

  const getBackgroundColor = (item: SideBarItemTypes) => {
    if (item.route.includes("orders") && pathName.includes("orders")) {
      return "#457b9d";
    }
    return item.route === pathName ? "#457b9d" : null;
  };

  return (
    <Box
      sx={{
        height: "100dvh",
        width: 270,
        background: "#1d3557",
      }}
    >
      <List sx={{ pt: 0 }}>
        {sideBarItems.map((item) => (
          <Link
            href={item.route}
            key={item.id}
            style={{ textDecoration: "none", cursor: "pointer" }}
          >
            <ListItem
              disablePadding
              sx={{
                ":hover": { background: "#457b9d" },
                bgcolor: getBackgroundColor(item),
              }}
            >
              <ListItemButton>
                <ListItemIcon sx={{ color: "#e8f6ef" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: "#e8f6ef" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );
};

export default SideBar;

const sideBarItems: SideBarItemTypes[] = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/backoffice/orders",
  },
  {
    id: 2,
    label: "Menu Categories",
    icon: <CategoryIcon />,
    route: "/backoffice/menu-categories",
  },
  {
    id: 3,
    label: "Menus",
    icon: <LocalDiningIcon />,
    route: "/backoffice/menus",
  },
  {
    id: 4,
    label: "Addon Categories",
    icon: <ClassIcon />,
    route: "/backoffice/addon-categories",
  },
  {
    id: 5,
    label: "Addons",
    icon: <EggIcon />,
    route: "/backoffice/addons",
  },
  {
    id: 6,
    label: "Tables",
    icon: <TableBarIcon />,
    route: "/backoffice/tables",
  },
  {
    id: 7,
    label: "Locations",
    icon: <LocationOnIcon />,
    route: "/backoffice/locations",
  },
  {
    id: 8,
    label: "Settings",
    icon: <SettingsIcon />,
    route: "/backoffice/company",
  },
];
