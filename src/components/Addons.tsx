import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import type { AddonCategories, Addons as AddonType } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  addonCategory: AddonCategories;
  addonsInCategory: AddonType[];
  selectedAddons: AddonType[];
  setSelectedAddons: Dispatch<SetStateAction<AddonType[]>>;
}

const Addons = ({
  addonCategory,
  addonsInCategory,
  selectedAddons,
  setSelectedAddons,
}: Props) => {
  if (!addonCategory) return null;
  return (
    <Box sx={{ px: 2 }}>
      {addonsInCategory.map((addon) => {
        return (
          <Box
            key={addon.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                addonCategory.isRequired ? (
                  <Radio
                    sx={{ "&.Mui-checked": { color: "#457b9d" } }}
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={() => {
                      // addonIds of current clicked addon's category
                      const addonIds = addonsInCategory.map((item) => item.id);
                      // filter out all addons in selectedAddons which is not belong to the current clicked addon's category
                      const filterOutAddonsInSelectedAddons =
                        selectedAddons.filter(
                          (item) => !addonIds.includes(item.id)
                        );
                      // after filtering out, add new clicked addon
                      setSelectedAddons([
                        ...filterOutAddonsInSelectedAddons,
                        addon,
                      ]);
                    }}
                  />
                ) : (
                  <Checkbox
                    sx={{ "&.Mui-checked": { color: "#457b9d" } }}
                    checked={
                      selectedAddons.find((item) => item.id === addon.id)
                        ? true
                        : false
                    }
                    onChange={(_, value) => {
                      if (value) {
                        setSelectedAddons([...selectedAddons, addon]);
                      } else {
                        const selected = selectedAddons.filter(
                          (item) => item.id !== addon.id
                        );
                        setSelectedAddons(selected);
                      }
                    }}
                  />
                )
              }
              label={addon.name}
            />
            <Typography sx={{ fontStyle: "italic" }}>
              RM {addon.price}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default Addons;
