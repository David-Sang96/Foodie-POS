import { ShoppingCartCheckout } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";

interface CartButtonProps {
  tableId: number;
}

export async function CartButton({ tableId }: CartButtonProps) {
  const cartOrder = await prisma.orders.findMany({
    where: { tableId, status: ORDERSTATUS.CART },
  });

  return (
    <Link
      href={`/order/cart?tableId=${tableId}`}
      style={{ position: "absolute", zIndex: 20, right: 150, top: 20 }}
    >
      <Box sx={{ display: "flex" }}>
        <ShoppingCartCheckout sx={{ color: "white" }} fontSize="large" />
        <Typography variant="h5" sx={{ color: "white" }}>
          {cartOrder.length}
        </Typography>
      </Box>
    </Link>
  );
}
