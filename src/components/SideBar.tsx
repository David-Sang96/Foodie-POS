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

const SideBar = () => {
  return (
    <Box
      sx={{
        height: "100vh",
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

const sideBarItems = [
  {
    id: 1,
    label: "Orders",
    icon: <LocalMallIcon />,
    route: "/backoffice",
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
