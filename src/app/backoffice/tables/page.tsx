"use client";

import ItemCard from "@/components/ItemCard";
import { getLocationTables } from "@/libs/actions";
import TableBarIcon from "@mui/icons-material/TableBar";
import { Box, Button } from "@mui/material";
import type { Tables } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

const TablesPage = () => {
  const [tables, setTables] = useState<Tables[]>();

  const getTables = async () => {
    const currentLocationId = localStorage.getItem(
      "current_location_id"
    ) as string;
    const data = await getLocationTables(Number(currentLocationId));
    setTables(data);
  };

  useEffect(() => {
    getTables();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link href={"/backoffice/tables/new"}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#1D3557", "&:hover": { bgcolor: "#2d4466" } }}
          >
            New table
          </Button>
        </Link>
      </Box>
      <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
        {tables?.map((table) => (
          <ItemCard
            icon={<TableBarIcon fontSize="large" />}
            key={table.id}
            title={table.name}
            href={`/backoffice/tables/${table.id}`}
            isAvailable
          />
        ))}
      </Box>
    </>
  );
};
export default TablesPage;
