import { useState, useEffect, useRef } from "react";
import { IconButton, Stack, TextField, Button } from "@mui/material";
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
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawWheel(ctx, canvas, slices);
  }, [slices]);

  const updateSlice = (index: number, property: string, value: string) => {
    setSlices((prevSlices) => {
      const updatedSlices = prevSlices.map((slice, i) =>
        i === index ? { ...slice, [property]: value } : slice
      );

      // Check if the total percentage is greater than 100
      const totalPercentage = updatedSlices.reduce(
        (sum, slice) => sum + parseFloat(slice.chance) || 0,
        0
      );

      // If total percentage is greater than 100, do not update the slices
      if (totalPercentage <= 100) {
        return updatedSlices;
      } else {
        // You can handle this case by displaying an error or taking other appropriate actions
        console.error("Total percentage cannot exceed 100%");
        return prevSlices;
      }
    });
  };

  const addSlice = () => {
    setSlices((prev) => [
      ...prev,
      {
        name: "",
        chance: "10%",
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      },
    ]);
  };

  const deleteSlice = (index: number) => {
    setSlices((prevSlices) => prevSlices.filter((_, i) => i !== index));
  };

  const saveImage = (event: any) => {
    if (canvasRef.current) {
      let link = event.currentTarget;
      link.setAttribute("download", "canvas.png");
      let image = canvasRef.current.toDataURL("image/png");
      link.setAttribute("href", image);
      console.log(image);
    }
  };

  const xd = () => {
    console.log({
      name: wheelName,
      sectors: slices.map((slice) => {
        return {
          label: slice.name,
          chance: parseFloat(slice.chance.replace("%", "")) / 100,
        };
      }),
    });
  };

  const splitPercentageEvenly = () => {
    setSlices(
      slices.map((slice) => {
        return {
          ...slice,
          chance: ((1 / slices.length) * 100).toFixed(2),
        };
      })
    );
  };

  return (
    <div className="wheelOfFortune-wrapper">
      <div className="wheelOfFortune-wheel">
        <button onClick={() => splitPercentageEvenly()}>
          split percentage evenly
        </button>
        <a id="download_image_link" href="download_link" onClick={saveImage}>
          download
        </a>
        <button onClick={xd}>xd</button>
        <Button
          variant="contained"
          onClick={addSlice}
          disabled={
            slices.reduce((sum, slice) => {
              const chance = parseFloat(slice.chance) || 0;
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
            <canvas ref={canvasRef} width={500} height={500}></canvas>
            <TextField
              inputProps={{ maxLength: 25 }}
              id="input-with-sx"
              label="Nazwa Koła"
              variant="standard"
              value={wheelName}
              onChange={(e) => setWheelName(e.target.value)}
            />
          </>
        )}
      </div>
      <div className="inputsWrapper">
        {slices.map((slice, index) => (
          <div className="singleInputWrapper" key={index}>
            <div
              style={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IconButton
                size="large"
                onClick={() => deleteSlice(index)}
                color="inherit"
              >
                <DeleteIcon />
              </IconButton>
            </div>
            <Stack spacing={2}>
              <Item
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <SliceInput
                  label="Nazwa"
                  value={slice.name}
                  onChange={(e) => updateSlice(index, "name", e.target.value)}
                  Icon={<AbcIcon sx={{ mr: 1, my: 0.5 }} />}
                />
                <SliceInput
                  label="Procent szans"
                  value={slice.chance}
                  onChange={(e) => updateSlice(index, "chance", e.target.value)}
                  Icon={<PercentIcon sx={{ mr: 1, my: 0.5 }} />}
                />
                <SliceInput
                  label="Kolor"
                  value={slice.color}
                  onChange={(e) => updateSlice(index, "color", e.target.value)}
                  Icon={<ColorLensIcon sx={{ mr: 1, my: 0.5 }} />}
                  ColorPicker={
                    <HuePicker
                      color={slice.color}
                      onChange={(color) =>
                        updateSlice(index, "color", color.hex)
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
  );
}

export default WheelOfFortune;
