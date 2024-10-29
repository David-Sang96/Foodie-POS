"use client";

import { Checkbox, FormControlLabel } from "@mui/material";
import { Locations } from "@prisma/client";

interface Props {
  id: string;
  locations: Locations[];
}

const LocationCheckBox = ({ id, locations }: Props) => {
  const isCurrentLocationId = localStorage.getItem("current_location_id");

  if (!localStorage) return null;

  return (
    <FormControlLabel
      control={
        <Checkbox
          defaultChecked={id === isCurrentLocationId}
          name="isAvailable"
          onChange={(_, checked) => {
            if (checked) {
              localStorage.setItem("current_location_id", id);
            } else {
              localStorage.setItem(
                "current_location_id",
                String(locations[0].id)
              );
            }
          }}
        />
      }
      label="Current Location"
    />
  );
};

export default LocationCheckBox;
