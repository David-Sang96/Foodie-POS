import { getCompanyMenuCategories, getSelectedLocation } from "@/libs/actions";
import { prisma } from "@/libs/prisma";
import { getMenu } from "../actions";
import MenuDeleteForm from "./MenuDeleteForm";
import MenuUpdateForm from "./MenuUpdateForm";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenu = async ({ params }: Props) => {
  const { id } = params;
  const menu = await getMenu(Number(id));
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const menuCategories = await getCompanyMenuCategories();
  const isAvailable = !menu.disabledLocationMenus.find(
    (item) => item.menuId === Number(id) && item.locationId === selectedLocation
  );
  const menuCategoryIds = (
    await prisma.menuCategoriesMenus.findMany({
      where: { menuId: Number(id) },
    })
  ).map((item) => item.menuCategoryId);

  return (
    <>
      <MenuDeleteForm id={id} />
      <MenuUpdateForm
        id={id}
        menu={menu}
        menuCategories={menuCategories}
        menuCategoryIds={menuCategoryIds}
        isAvailable={isAvailable}
      />
    </>
  );
};

export default UpdateMenu;
