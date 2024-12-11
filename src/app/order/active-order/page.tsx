import { Box, Button, Divider, Typography } from "@mui/material";
import { ORDERSTATUS } from "@prisma/client";
import Link from "next/link";
import { getCardTotalPrice } from "../cart/actions";

interface ActiveOrderPageProp {
  searchParams: {
    tableId: string;
  };
}

const ActiveOrderPage = async ({ searchParams }: ActiveOrderPageProp) => {
  const tableId = Number(searchParams.tableId);
  const cartOrders = await prisma.orders.findMany({
    where: { tableId, NOT: { status: ORDERSTATUS.CART } },
    include: { menus: true },
  });

  if (!cartOrders.length)
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
    <Box sx={{ maxWidth: 550, margin: "auto", pt: 4 }}>
      {cartOrders.map(async (cartOrder) => {
        const { id, menus, quantity } = cartOrder;
        const orderAddons = await prisma.orderAddons.findMany({
          where: { orderId: id },
          include: { addons: true },
        });
        const addons = orderAddons.map((item) => item.addons);
        return (
          <Box key={id} pb={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pb: 1,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Typography
                  sx={{
                    bgcolor: "green",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "50%",
                  }}
                >
                  {quantity}
                </Typography>
                <Typography>{menus.name}</Typography>
              </Box>
              <Typography>RM {menus.price}</Typography>
            </Box>
            <Box>
              {addons.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 1,
                    pl: 6,
                  }}
                >
                  <Typography fontSize={14} fontStyle={"italic"}>
                    {item.name}
                  </Typography>
                  <Typography fontSize={14} fontStyle={"italic"}>
                    RM {item.price}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
      <Divider sx={{ borderBottomWidth: 2 }} />
      <Box pt={2}>
        <Typography align="right">
          Total price : RM {await getCardTotalPrice(Number(tableId))}
        </Typography>
      </Box>
    </Box>
  );
};

export default ActiveOrderPage;
