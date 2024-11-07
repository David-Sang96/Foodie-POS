import { Box, Button, TextField } from "@mui/material";
import { getCompany, updateCompany } from "./actions";

const UpdateCompany = async () => {
  const company = await getCompany();
  return (
    <>
      <Box
        sx={{ width: "40%", mt: 5 }}
        component={"form"}
        action={updateCompany}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <TextField
            variant="outlined"
            label="Name"
            defaultValue={company?.name}
            name="name"
          />
          <TextField
            variant="outlined"
            label="Address"
            defaultValue={company?.address}
            name="address"
          />
          <TextField
            variant="outlined"
            label="City"
            defaultValue={company?.city}
            name="city"
          />
          <TextField
            variant="outlined"
            label="Zip Code"
            defaultValue={company?.zipCode}
            name="zipCode"
          />
          <TextField
            variant="outlined"
            label="Calling Code"
            defaultValue={company?.callingCode}
            name="callingCode"
          />
          <TextField
            variant="outlined"
            label="Country"
            defaultValue={company?.country}
            name="country"
          />
          <input type="hidden" value={company?.id} name="id" />

          <Button
            sx={{
              bgcolor: "#1D3557",
              "&:hover": { bgcolor: "#2d4466" },
              width: "fit-content",
            }}
            variant="contained"
            type="submit"
          >
            Update
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default UpdateCompany;
