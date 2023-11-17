import { useState, useEffect, useRef } from "react";
import {
  IconButton,
  Stack,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import PercentIcon from "@mui/icons-material/Percent";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import "./style.scss";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { Slice, drawWheel } from "./drawingWheel";
import { SliceInput } from "./SliceInput";
import { HuePicker } from "react-color";
import {
  addSlice,
  deleteSlice,
  splitPercentageEvenly,
  updateSlice,
} from "./slicesFunctions";
import { xd2 } from "./mocks";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function WheelOfFortune() {
  const [slices, setSlices] = useState<Slice[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [wheelName, setWheelName] = useState("");
  const [selectedWheel, setSelectedWheel] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawWheel(ctx, canvas, slices);
  }, [slices]);

  useEffect(() => {
    const selectedSlices = xd2.find(
      ({ name }) => selectedWheel === name
    )?.sectors;
    selectedSlices &&
      setSlices(
        selectedSlices.map((slice) => {
          return {
            ...slice,
            chance: slice.chance * 100,
          };
        })
      );
  }, [selectedWheel]);

  const xd = (event: any) => {
    let image;
    if (canvasRef.current) {
      image = canvasRef.current.toDataURL("image/png");
    }
    console.log({
      name: wheelName,
      image: image,
      sectors: slices.map((slice) => {
        return {
          label: slice.label,
          chance: slice.chance / 100,
          color: slice.color,
        };
      }),
    });
  };

  return (
    <div className="wheelOfFortune-wrapper">
      <div className="wheelOfFortune-wheel">
        <button onClick={xd}>xd</button>
        <Button
          variant="contained"
          onClick={() => addSlice(setSlices)}
          disabled={
            slices.reduce((sum, slice) => {
              const chance = slice.chance || 0;
              return sum + chance;
            }, 0) >= 100
          }
        >
          +
        </Button>
        {slices.length <= 0 ? (
          <>Empty</>
        ) : (
          <>
            <canvas ref={canvasRef} width={400} height={400}></canvas>
            <TextField
              inputProps={{ maxLength: 25 }}
              id="input-with-sx"
              label="Nazwa Koła"
              variant="standard"
              value={wheelName}
              onChange={(e) => setWheelName(e.target.value)}
            />
            <Box sx={{ minWidth: 150 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Wybierz koło
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Wybierz koło"
                  value={selectedWheel}
                  onChange={(e) => setSelectedWheel(e.target.value)}
                >
                  {xd2.map(({ name }) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </>
        )}
      </div>
      <div className="buttonAndInputsWrapper">
        {slices.length > 0 && (
          <div className="buttonWrapper">
            <Button
              variant="contained"
              onClick={() => splitPercentageEvenly(slices, setSlices)}
            >
              split percentage evenly
            </Button>
          </div>
        )}

        <div className="inputsWrapper">
          {slices.map((slice, index) => (
            <div className="singleInputWrapper" key={index}>
              <Stack spacing={2}>
                <Item
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: "0",
                      zIndex: "2",
                      top: "0",
                    }}
                  >
                    <IconButton
                      size="large"
                      onClick={() => deleteSlice(index, setSlices)}
                      color="inherit"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                  <SliceInput
                    label="Nazwa"
                    value={slice.label}
                    onChange={(e) =>
                      updateSlice(index, "label", e.target.value, setSlices)
                    }
                    Icon={<AbcIcon sx={{ mr: 1, my: 0.5 }} />}
                  />
                  <SliceInput
                    label="Procent szans"
                    value={slice.chance}
                    onChange={(e) =>
                      updateSlice(index, "chance", e.target.value, setSlices)
                    }
                    Icon={<PercentIcon sx={{ mr: 1, my: 0.5 }} />}
                  />
                  <SliceInput
                    label="Kolor"
                    value={slice.color}
                    onChange={(e) =>
                      updateSlice(index, "color", e.target.value, setSlices)
                    }
                    Icon={<ColorLensIcon sx={{ mr: 1, my: 0.5 }} />}
                    ColorPicker={
                      <HuePicker
                        color={slice.color}
                        onChange={(color) =>
                          updateSlice(index, "color", color.hex, setSlices)
                        }
                      />
                    }
                  />
                </Item>
              </Stack>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WheelOfFortune;
