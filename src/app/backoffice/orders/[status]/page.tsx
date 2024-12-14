import OrderCard from "@/components/OrderCard";
import { getSelectedLocationTables } from "@/libs/actions";
import { Box, Button, ButtonGroup } from "@mui/material";
import { ORDERSTATUS, Prisma } from "@prisma/client";
import Link from "next/link";

interface OrdersPageProps {
  params: {
    status: ORDERSTATUS;
  };
}

export type OrdersWithMenusAndTablesAndOrderAddons = Prisma.OrdersGetPayload<{
  include: { menus: true; tables: true; orderAddons: true };
}>;

export type AddonWithAddonCategories = Prisma.AddonsGetPayload<{
  include: { addonCategory: true };
}>;

const OrderStatusPage = async ({ params }: OrdersPageProps) => {
  const status = params.status.toUpperCase();
  const tables = await getSelectedLocationTables();
  const tableIds = tables.map((table) => table.id);
  const orders: OrdersWithMenusAndTablesAndOrderAddons[] =
    await prisma.orders.findMany({
      where: {
        tableId: { in: tableIds },
        status: status as keyof typeof ORDERSTATUS,
      },
      include: { menus: true, tables: true, orderAddons: true },
    });

  return (
    <Box>
      <ButtonGroup
        variant="outlined"
        aria-label="Basic button group"
        sx={{ display: "flex", justifyContent: "end" }}
      >
        <Link href={"/backoffice/orders/pending"}>
          <Button
            variant={`${
              status === ORDERSTATUS.PENDING ? "contained" : "outlined"
            }`}
          >
            pending
          </Button>
        </Link>
        <Link href={"/backoffice/orders/cooking"}>
          <Button
            variant={`${
              status === ORDERSTATUS.COOKING ? "contained" : "outlined"
            }`}
          >
            cooking
          </Button>
        </Link>
        <Link href={"/backoffice/orders/complete"}>
          <Button
            variant={`${
              status === ORDERSTATUS.COMPLETE ? "contained" : "outlined"
            }`}
          >
            complete
          </Button>
        </Link>
      </ButtonGroup>
      <Box sx={{ display: "flex", flexWrap: "wrap", mt: 2, gap: 1.5 }}>
        {orders.map(async (order) => {
          const addonIds = order.orderAddons.map((item) => item.addonId);
          const addons: AddonWithAddonCategories[] =
            await prisma.addons.findMany({
              where: { id: { in: addonIds } },
              include: { addonCategory: true },
            });
          return (
            <OrderCard order={order} key={order.id} addons={addons} isAdmin />
          );
        })}
      </Box>
    </Box>
  );
};

export default OrderStatusPage;
