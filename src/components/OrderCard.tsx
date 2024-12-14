import {
  AddonWithAddonCategories,
  OrdersWithMenusAndTablesAndOrderAddons,
} from "@/app/backoffice/orders/[status]/page";
import { getTotalPriceByOrderId } from "@/app/backoffice/orders/action";
import { Box, Card, Divider, Typography } from "@mui/material";
import OrderStatusUpdate from "./OrderStatusUpdate";

interface OrderCardProps {
  order: OrdersWithMenusAndTablesAndOrderAddons;
  addons: AddonWithAddonCategories[];
  isAdmin?: boolean;
}

const OrderCard = async ({ order, addons, isAdmin }: OrderCardProps) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 250,
        height: 280,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "top",
          bgcolor: "#457b9d",
          color: "white",
          px: 1,
          py: 1,
        }}
      >
        <Typography>{order.menus.name}</Typography>
        <Typography>
          {isAdmin
            ? order.tables.name
            : `RM ${await getTotalPriceByOrderId(order.id)}`}
        </Typography>
      </Box>
      <Box sx={{ px: 2, pt: 1 }}>
        <Box className="scroll-container">
          {order.orderAddons.length ? (
            order.orderAddons.map((orderAddon) => {
              const addon = addons.find(
                (addon) => addon.id === orderAddon.addonId
              );
              return (
                <Box key={orderAddon.id} sx={{ mb: 2 }}>
                  <Typography>{addon?.addonCategory.name}</Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      ml: 2,
                      fontStyle: "italic",
                      fontWeight: "bold",
                    }}
                  >
                    {addon?.name}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                overflowY: "hidden",
              }}
            >
              <Typography> No addon</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Divider />

      <OrderStatusUpdate order={order} isAdmin={isAdmin} />
    </Card>
  );
};

export default OrderCard;
