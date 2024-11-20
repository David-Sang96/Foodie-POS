import OrderAppHeader from "@/components/OrderAppHeader";
import { getCompanyByTableId } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { Box } from "@mui/material";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    tableId: string;
  };
}

const OrderMenuDetails = async ({ params, searchParams }: Props) => {
  const company = await getCompanyByTableId(searchParams.tableId);
  const menu = await prisma.menus.findFirst({
    where: { id: Number(params.id), isArchived: false },
    include: { menusAddonCategories: true },
  });
  const addonCategoryIds = menu?.menusAddonCategories.map(
    (item) => item.addonCategoryId
  );
  const addons = await prisma.addons.findMany({
    where: { addonCategoryId: { in: addonCategoryIds } },
  });

  if (!menu || !company) return null;

  return (
    <Box>
      <OrderAppHeader
        company={company}
        headerMenuImageUrl={menu.imageUrl as string}
      />
    </Box>
  );
};

export default OrderMenuDetails;
