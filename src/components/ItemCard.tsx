import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  href: string;
  isAvailable?: boolean | null;
  subtitle?: string;
}

export default function ItemCard({
  icon,
  title,
  href,
  isAvailable,
  subtitle,
}: Props) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          width: 200,
          height: 150,
          display: "flex",
          justifyContent: "center",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "scale(1)",
            boxShadow: 6,
          },
          opacity: isAvailable ? 1 : 0.4,
        }}
        elevation={2}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          {icon}
          <Typography component="div" sx={{ fontWeight: "600" }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography component="div" sx={{ fontSize: 14 }}>
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
