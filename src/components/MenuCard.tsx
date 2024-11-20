import { Box } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Menus } from "@prisma/client";
import Link from "next/link";

interface Props {
  menu: Menus;
  isAvailable?: boolean;
  showIsAvailable?: boolean;
  relatedUrl: string;
}

export default function MenuCard({
  menu,
  isAvailable,
  relatedUrl,
  showIsAvailable,
}: Props) {
  return (
    <Link href={relatedUrl} style={{ textDecoration: "none", width: 240 }}>
      <Card
        sx={{
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1.03)",
            boxShadow: 6,
          },
          borderRadius: 1,
        }}
        elevation={3}
      >
        <CardMedia
          sx={{
            height: 150,
            width: "100%",
            borderRadius: "5px 5px 0 0", // Rounded corners on top
          }}
          image={
            menu.imageUrl ||
            "https://cdn.pixabay.com/photo/2024/02/23/08/27/apple-8591539_1280.jpg"
          }
          title="Menu Image"
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1, // margin bottom for spacing
            }}
          >
            <Typography
              sx={{ fontWeight: "bold" }} // Bold title
            >
              {menu.name}
            </Typography>
            <Typography
              sx={{
                backgroundColor: "#ADD8E6",
                padding: "4px",
                borderRadius: "20%",
                fontSize: "14px",
                color: "#000",
              }}
            >
              RM {menu.price}
            </Typography>
          </Box>
          {showIsAvailable && (
            <Typography
              sx={{
                backgroundColor: isAvailable ? "success.light" : "error.light",
                color: "white",
                padding: "6px",
                borderRadius: "4px",
                textAlign: "center",
                fontWeight: "medium",
                width: "50%",
              }}
              fontSize={"small"}
            >
              {isAvailable ? "Available" : "Sold Out"}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
