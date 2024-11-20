import {
  getCompanyAddonCategories,
  getCompanyMenuCategories,
  getSelectedLocation,
} from "@/libs/actions";
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
  const isAvailable = !menu.disabledLocationMenus.find(
    (item) => item.menuId === Number(id) && item.locationId === selectedLocation
  );
  const menuCategories = await getCompanyMenuCategories();
  const menuCategoryIds = menu.menuCategoriesMenus.map(
    (item) => item.menuCategoryId
  );
  const addonCategories = await getCompanyAddonCategories();
  const addonCategoryIds = menu.menusAddonCategories.map(
    (item) => item.addonCategoryId
  );

  return (
    <>
      <MenuDeleteForm id={id} />
      <MenuUpdateForm
        id={id}
        menu={menu}
        menuCategories={menuCategories}
        selectedMenuCategoryIds={menuCategoryIds}
        addonCategories={addonCategories}
        selectedAddonCategoryIds={addonCategoryIds}
        isAvailable={isAvailable}
      />
    </>
  );
};

export default UpdateMenu;
