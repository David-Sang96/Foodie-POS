import MenuCategoryTab from "@/components/MenuCategoryTab";
import OrderAppHeader from "@/components/OrderAppHeader";
import {
  getCompanyByTableId,
  getMenuCategoriesByTableId,
  getMenusByMenuCategoryIds,
} from "@/libs/actions";
import { Box } from "@mui/material";
import type { Prisma } from "@prisma/client";

interface Props {
  searchParams: {
    tableId: string;
  };
}

export type MenuCategoryType = Prisma.MenuCategoriesGetPayload<{
  include: { menuCategoriesMenus: true; company: true };
}>;

export type MenuType = Prisma.MenusGetPayload<{
  include: { disabledLocationMenus: true };
}>;

const OrderApp = async ({ searchParams }: Props) => {
  const { tableId } = searchParams;
  const company = await getCompanyByTableId(tableId);
  const menuCategories: MenuCategoryType[] = await getMenuCategoriesByTableId(
    tableId
  );
  const menuCategoryIds = menuCategories.map((item) => item.id);
  const menus = await getMenusByMenuCategoryIds(menuCategoryIds, tableId);

  if (!company) return null;
  return (
    <Box>
      <OrderAppHeader company={company} tableId={tableId} />
      <MenuCategoryTab
        menuCategories={menuCategories}
        menus={menus}
        tableId={tableId}
      />
    </Box>
  );
};

export default OrderApp;
