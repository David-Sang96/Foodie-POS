"use client";

import { Box, Button } from "@mui/material";
import Image from "next/image";

interface Props {
  qrImageUrl: string;
}

const QrImage = ({ qrImageUrl }: Props) => {
  const printQRImage = () => {
    const imageWindow = window.open("");
    imageWindow?.document.write(
      `<html><head><title>Print Image</title></head><body style="height : 100%;display : flex;justify-content : center;align-items : center"><img src="${qrImageUrl}" style="width : 300px;height : 300px" onload="window.print();window.close()"/></body></html>`
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Image src={qrImageUrl} alt="qr-image" width={150} height={150} />
      <Button variant="contained" sx={{ mb: 2 }} onClick={printQRImage}>
        Print
      </Button>
    </Box>
  );
};

export default QrImage;
