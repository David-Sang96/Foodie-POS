import { Box, Divider, Typography } from "@mui/material";

interface Props {
  searchParams: {
    tableId: string;
  };
}

const CartPage = async ({ searchParams }: Props) => {
  const tableId = Number(searchParams.tableId);
  const cartOrders = await prisma.orders.findMany({
    where: { tableId },
    include: { menus: true },
  });

  if (!cartOrders.length) return null;

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
            <>
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
                  <Typography fontSize={14}>RM {item.price}</Typography>
                </Box>
              ))}
            </>
            <Divider />
          </Box>
        );
      })}
    </Box>
  );
};

export default CartPage;
