"use client";

import { updateOrderStatus } from "@/app/backoffice/orders/action";
import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Orders, ORDERSTATUS } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface OrderStatusUpdateProps {
  order: Orders;
  isAdmin?: boolean;
}

function OrderStatusUpdate({ order, isAdmin }: OrderStatusUpdateProps) {
  const router = useRouter();

  useEffect(() => {
    if (order.status !== ORDERSTATUS.COMPLETE) {
      const intervalId = setInterval(() => {
        router.refresh();
      }, 5000);

      return () => clearInterval(intervalId);
    }
  }, [order, router]);

  const handleOrderStatusUpdate = async (
    e: SelectChangeEvent<"CART" | "PENDING" | "COOKING" | "COMPLETE">
  ) => {
    await updateOrderStatus(order.id, e.target.value as ORDERSTATUS);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        height: "100%",
      }}
    >
      {isAdmin ? (
        <>
          <Typography sx={{ fontWeight: "bold" }}>Status: </Typography>
          <Select
            sx={{ maxHeight: 30, fontSize: 13 }}
            value={order.status}
            onChange={handleOrderStatusUpdate}
          >
            <MenuItem value={ORDERSTATUS.PENDING} sx={{ fontSize: 13 }}>
              {ORDERSTATUS.PENDING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COOKING} sx={{ fontSize: 13 }}>
              {ORDERSTATUS.COOKING}
            </MenuItem>
            <MenuItem value={ORDERSTATUS.COMPLETE} sx={{ fontSize: 13 }}>
              {ORDERSTATUS.COMPLETE}
            </MenuItem>
          </Select>
        </>
      ) : (
        <>
          <Typography sx={{ fontWeight: "bold" }}>Status: </Typography>
          <Typography sx={{ fontWeight: "bold" }}>{order.status}</Typography>
        </>
      )}
    </Box>
  );
}

export default OrderStatusUpdate;
