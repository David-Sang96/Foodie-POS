import { Box, Chip, Typography } from "@mui/material";
import type { AddonCategories, Addons as AddonType } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import Addons from "./Addons";

interface Props {
  addonCategories: AddonCategories[];
  addons: AddonType[];
  selectedAddons: AddonType[];
  setSelectedAddons: Dispatch<SetStateAction<AddonType[]>>;
}

const AddonCategoriesAndAddons = ({
  addonCategories,
  addons,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  return (
    <Box sx={{ width: "100%" }}>
      {addonCategories.map((item) => {
        const filteredAddonsByCategory = addons.filter(
          (addon) => addon.addonCategoryId === item.id
        );
        return (
          <Box key={item.id} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ userSelect: "none" }}>
                {item.name}
              </Typography>
              <Chip label={item.isRequired ? "Required" : "Optional"} />
            </Box>
            <Box>
              <Addons
                addonCategory={item}
                addonsInCategory={filteredAddonsByCategory}
                selectedAddons={selectedAddons}
                setSelectedAddons={setSelectedAddons}
              />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default AddonCategoriesAndAddons;
