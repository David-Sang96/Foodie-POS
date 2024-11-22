"use client";

import type {
  MenuWithMenusAddonCategories,
  OrdersWithOrderAddons,
} from "@/app/order/menus/[id]/page";
import { Box, Button } from "@mui/material";
import type { AddonCategories, Addons } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddonCategoriesAndAddons from "./AddonCategoriesAndAddons";
import QuantitySelector from "./QuantitySelector";

interface Props {
  menu: MenuWithMenusAddonCategories;
  addonCategories: AddonCategories[];
  addons: Addons[];
  tableId: string;
  order?: OrdersWithOrderAddons | null;
}

const MenuOptions = ({ addonCategories, addons, tableId }: Props) => {
  const [selectedAddons, setSelectedAddons] = useState<Addons[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const requiredAddonCategory = addonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequiredAddons = selectedAddons.filter((selectedAddon) => {
      const addonCategory = addonCategories.find(
        (item) => item.id === selectedAddon.addonCategoryId
      );
      return addonCategory?.isRequired ? true : false;
    });
    const isDisabled =
      requiredAddonCategory.length !== selectedRequiredAddons.length;
    setIsDisabled(isDisabled);
  }, [selectedAddons, addonCategories]);

  const handleIncreaseQuantity = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((quantity) => (quantity - 1 === 0 ? 1 : quantity - 1));
  };

  const handleCreateCartOrder = () => {};

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 10,
        px: 2,
        position: "relative",
        marginTop: { xs: 15, md: -5, lg: -30 },
      }}
    >
      <AddonCategoriesAndAddons
        addonCategories={addonCategories}
        addons={addons}
        selectedAddons={selectedAddons}
        setSelectedAddons={setSelectedAddons}
      />
      <QuantitySelector
        onDecrease={handleDecreaseQuantity}
        onIncrease={handleIncreaseQuantity}
        value={quantity}
      />
      <Button
        variant="contained"
        sx={{
          bgcolor: "#457b9d",
          color: "#fff",
          "&:hover": { bgcolor: "#457b9g" },
          mt: 1,
        }}
        disabled={isDisabled}
        onClick={handleCreateCartOrder}
      >
        Add to cart
      </Button>
    </Box>
  );
};

export default MenuOptions;
