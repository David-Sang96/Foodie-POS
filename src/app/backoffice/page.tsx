import { redirect } from "next/navigation";

const BackOfficePage = async () => {
  redirect("/backoffice/orders/pending");
};

export default BackOfficePage;
