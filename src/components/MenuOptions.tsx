"use client";

import { createCartOrder } from "@/app/order/cart/actions";
import type {
  MenuWithMenusAddonCategories,
  OrdersWithOrderAddons,
} from "@/app/order/menus/[id]/page";
import { Box, Button } from "@mui/material";
import type { AddonCategories, Addons } from "@prisma/client";
import { useEffect, useState } from "react";
import AddonCategoriesAndAddons from "./AddonCategoriesAndAddons";
import QuantitySelector from "./QuantitySelector";

interface Props {
  menu: MenuWithMenusAddonCategories;
  addonCategories: AddonCategories[];
  addons: Addons[];
  tableId: number;
  order?: OrdersWithOrderAddons | null;
}

const MenuOptions = ({ addonCategories, addons, tableId, menu }: Props) => {
  const [selectedAddons, setSelectedAddons] = useState<Addons[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  useEffect(() => {
    const requiredAddonCategory = addonCategories.filter(
      (item) => item.isRequired
    );
    const selectedRequiredAddons = selectedAddons.filter(
      (selectedAddon) =>
        !!requiredAddonCategory.find(
          (item) => item.id === selectedAddon.addonCategoryId
        )
    );
    setIsDisabled(
      requiredAddonCategory.length !== selectedRequiredAddons.length
    );
  }, [selectedAddons, addonCategories]);

  const handleIncreaseQuantity = () => {
    setQuantity((quantity) => quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((quantity) => (quantity - 1 === 0 ? 1 : quantity - 1));
  };

  const handleCreateCartOrder = async () => {
    await createCartOrder({
      menuId: menu.id,
      addonIds: selectedAddons.map((item) => item.id),
      quantity,
      tableId,
    });
  };

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
