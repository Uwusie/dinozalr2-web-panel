import { Box, TextField } from "@mui/material";
import { useState } from "react";

export const SliceInput = ({
  label,
  value,
  onChange,
  Icon,
  ColorPicker,
}: {
  label: string;
  value: string | number;
  onChange: (e: any) => void;
  Icon: React.ReactNode;
  ColorPicker?: any;
}) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      <div
        style={{ position: "relative" }}
        onClick={() => setOpenModal(!openModal)}
      >
        {Icon}
        {label === "Kolor" && openModal && (
          <div style={{ position: "absolute", zIndex: 2 }}>{ColorPicker}</div>
        )}
      </div>
      <TextField
        inputProps={{ maxLength: 25 }}
        id="input-with-sx"
        label={label}
        variant="standard"
        value={value}
        onChange={onChange}
      />
    </Box>
  );
};
