import OrderAppHeader from "@/components/OrderAppHeader";
import {
  getCompanyByTableId,
  getMenuCategoriesByTableId,
} from "@/libs/actions";

interface Props {
  searchParams: {
    tableId: string;
  };
}

const OrderApp = async ({ searchParams }: Props) => {
  const { tableId } = searchParams;
  const company = await getCompanyByTableId(tableId);
  const menuCategories = await getMenuCategoriesByTableId(tableId);
  console.log(menuCategories);
  if (!company) return null;
  return <OrderAppHeader company={company} />;
};

export default OrderApp;
