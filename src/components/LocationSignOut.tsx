"use client";

import { Button } from "@mui/material";
import type { Locations } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

interface Props {
  locations: Locations[];
}

const LocationSignOut = ({ locations }: Props) => {
  const [currentLocation, setCurrentLocation] = useState<Locations>();

  useEffect(() => {
    const currentLocationId = localStorage.getItem("current_location_id");
    if (!currentLocationId) {
      localStorage.setItem("current_location_id", String(locations[0].id));
    } else {
      const currentLocation = locations.find(
        (location) => location.id === Number(currentLocationId)
      );
      setCurrentLocation(currentLocation);
    }
  }, [locations]);

  return (
    <>
      <h3>{currentLocation?.name}</h3>
      <Button
        variant="contained"
        sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
        onClick={() => signOut()}
      >
        Logout
      </Button>
    </>
  );
};

export default LocationSignOut;
