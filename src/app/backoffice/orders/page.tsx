import { redirect } from "next/navigation";

const OrdersPage = () => {
  redirect("/backoffice/orders/pending");
};

export default OrdersPage;
