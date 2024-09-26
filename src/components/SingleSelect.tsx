import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MenuCategories } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

interface Props {
  title: string;
  selected: number | undefined;
  setSelected: Dispatch<SetStateAction<number | undefined>>;
  items: MenuCategories[];
}

const SingleSelect = ({ title, selected, setSelected, items }: Props) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel>{title}</InputLabel>
      <Select
        value={selected}
        label={title}
        onChange={(e) => setSelected(Number(e.target.value))}
      >
        {items.map((item) => (
          <MenuItem value={item.id} key={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SingleSelect;
