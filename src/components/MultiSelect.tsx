import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import { MenuCategories, Menus } from "@prisma/client";
import { SetStateAction } from "react";

interface Props {
  title: string;
  selected: number[];
  setSelected: (value: SetStateAction<number[]>) => void;
  items: MenuCategories[] | Menus[];
}

const MultiSelect = ({ title, selected, setSelected, items }: Props) => {
  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel>{title}</InputLabel>
      <Select
        multiple
        value={selected}
        onChange={(e) => {
          const selected = e.target.value as number[];
          setSelected(selected);
        }}
        input={<OutlinedInput label={title} />}
        renderValue={() => {
          return selected
            .map((itemId) => items.find((item) => item.id === itemId))
            .map((item) => item?.name)
            .join(", ");
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            <Checkbox checked={selected.includes(item.id)} />
            <ListItemText primary={item.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
