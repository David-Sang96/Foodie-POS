import { OrdersWithMenusAndTablesAndOrderAddons } from "@/app/backoffice/orders/[status]/page";
import OrderCard from "@/components/OrderCard";
import { Box, Button, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";
import { getTableTotalPrice } from "../cart/actions";

interface ActiveOrderPageProp {
  searchParams: {
    tableId: string;
  };
}

const ActiveOrderPage = async ({ searchParams }: ActiveOrderPageProp) => {
  const tableId = Number(searchParams.tableId);
  const orders: OrdersWithMenusAndTablesAndOrderAddons[] =
    await prisma.orders.findMany({
      where: { tableId, NOT: { status: ORDERSTATUS.CART } },
      include: { menus: true, tables: true, orderAddons: true },
    });

  if (!orders.length)
    return (
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" mb={2}>
          No active order yet.Order some tasty menus!
        </Typography>
        <Link href={`/order?tableId=${tableId}`}>
          <Button variant="contained"> go back home</Button>
        </Link>
      </Box>
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
        <Typography fontWeight={"bold"} variant="h5">
          Total price: RM {await getTableTotalPrice(Number(tableId))}
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: 1100,
          margin: "auto",
          pb: 6,
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        {orders.map(async (order) => {
          const addonIds = order.orderAddons.map((item) => item.addonId);
          const addons = await prisma.addons.findMany({
            where: { id: { in: addonIds } },
            include: { addonCategory: true },
          });
          return (
            <OrderCard
              order={order}
              addons={addons}
              isAdmin={false}
              key={order.id}
            />
          );
        })}
      </Box>
    </>
  );
};

export default ActiveOrderPage;
