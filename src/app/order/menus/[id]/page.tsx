import MenuOptions from "@/components/MenuOptions";
import OrderAppHeader from "@/components/OrderAppHeader";
import { getCompanyByTableId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { Box } from "@mui/material";
import type { Prisma } from "@prisma/client";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    tableId: string;
  };
}

export type MenuWithMenusAddonCategories = Prisma.MenusGetPayload<{
  include: { menusAddonCategories: true };
}>;

export type OrdersWithOrderAddons = Prisma.OrdersGetPayload<{
  include: { orderAddons: true };
}>;

const OrderMenuDetails = async ({ params, searchParams }: Props) => {
  const company = await getCompanyByTableId(searchParams.tableId);
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id), isArchived: false },
    include: { menusAddonCategories: true },
  });
  const addonCategoryIds = menu?.menusAddonCategories.map(
    (item) => item.addonCategoryId
  );
  const addonCategories = await prisma.addonCategories.findMany({
    where: { id: { in: addonCategoryIds }, isArchived: false },
  });
  const addons = await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds }, isArchived: false },
  });

  if (!menu || !company) return null;

  return (
    <Box>
      <OrderAppHeader
        company={company}
        headerMenuImageUrl={menu.imageUrl as string}
      />
      <MenuOptions
        menu={menu}
        addonCategories={addonCategories}
        addons={addons}
        tableId={Number(searchParams.tableId)}
      />
    </Box>
  );
};

export default OrderMenuDetails;
