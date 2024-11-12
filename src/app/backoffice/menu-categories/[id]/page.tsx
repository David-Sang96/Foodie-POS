import { getSelectedLocation } from "@/libs/actions";
import { getMenuCategory } from "../actions";
import MenuCategoryDeleteForm from "./MenuCategoryDeleteForm";
import MenuCategoryUpdateForm from "./MenuCategoryUpdateForm";

interface Props {
  params: {
    id: string;
  };
}

const UpdateMenuCategory = async ({ params }: Props) => {
  const { id } = params;
  const menuCategory = await getMenuCategory(id);
  const selectedLocation = (await getSelectedLocation())?.locationId;
  const isAvailable = !menuCategory.disabledLocationMenuCategories.find(
    (item) =>
      item.menuCategoryId === Number(id) &&
      item.locationId === selectedLocation &&
      item.isArchived === false
  );

  return (
    <>
      <MenuCategoryDeleteForm id={id} />
      <MenuCategoryUpdateForm
        id={id}
        menuCategory={menuCategory}
        isAvailable={isAvailable}
      />
    </>
  );
};

export default UpdateMenuCategory;
