import { Box, Typography } from "@mui/material";
import { Company } from "@prisma/client";
import Image from "next/image";

interface Props {
  company: Company;
  headerMenuImageUrl?: string;
}

const OrderAppHeader = ({ company, headerMenuImageUrl }: Props) => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          bgcolor: "#457b9d",
          height: 60,
          px: 2,
          display: { xs: "flex", md: "none" },
          justifyContent: "space-between",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#f1faee", textAlign: "start" }}
        >
          {company.name}
        </Typography>

        {headerMenuImageUrl && (
          <Image
            src={headerMenuImageUrl}
            alt="menu image"
            width={150}
            height={150}
            style={{ borderRadius: "50%", marginTop: 100 }}
          />
        )}
      </Box>
      <Box
        sx={{
          width: "100vw",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src={"/order-app-header.svg"}
          alt="header-image"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
        />
        <Box sx={{ position: "absolute" }}>
          <Box sx={{ textAlign: "center" }}>
            {!headerMenuImageUrl ? (
              <>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", color: "#f1faee", mt: 4 }}
                >
                  {company.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: "#f1faee",
                    mt: 1,
                    opacity: 0.6,
                    fontStyle: "italic",
                  }}
                >
                  {company.name}
                </Typography>
              </>
            ) : (
              <Image
                src={headerMenuImageUrl}
                alt="menu image"
                width={150}
                height={150}
                style={{ borderRadius: "50%", marginTop: 12 }}
              />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderAppHeader;
