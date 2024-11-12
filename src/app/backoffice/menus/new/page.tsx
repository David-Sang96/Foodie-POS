import { getCompanyMenuCategories } from "@/libs/actions";
import NewMenuForm from "./NewMenuForm";

const NewMenuPage = async () => {
  const menuCategories = await getCompanyMenuCategories();

  return <NewMenuForm menuCategories={menuCategories} />;
};

export default NewMenuPage;
