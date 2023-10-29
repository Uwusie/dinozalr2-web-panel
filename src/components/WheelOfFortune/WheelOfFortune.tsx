import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Stack, TextField, Button } from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import PercentIcon from "@mui/icons-material/Percent";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import "./style.scss";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import { Slice, drawWheel } from "./drawingWheel";

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
    setSlices((prevSlices) =>
      prevSlices.map((slice, i) =>
        i === index ? { ...slice, [property]: value } : slice
      )
    );
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

  return (
    <div className="wheelOfFortune-wrapper">
      <div className="wheelOfFortune-wheel">
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
      </div>{" "}
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
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <AbcIcon sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    inputProps={{ maxLength: 25 }}
                    id="input-with-sx"
                    label="Nazwa"
                    variant="standard"
                    value={slice.name}
                    onChange={(e) => updateSlice(index, "name", e.target.value)}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <PercentIcon sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    inputProps={{ maxLength: 25 }}
                    id="input-with-sx"
                    label="Procent szans"
                    variant="standard"
                    value={slice.chance}
                    onChange={(e) =>
                      updateSlice(index, "chance", e.target.value)
                    }
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <ColorLensIcon sx={{ mr: 1, my: 0.5 }} />
                  <TextField
                    inputProps={{ maxLength: 25 }}
                    id="input-with-sx"
                    label="Kolor"
                    variant="standard"
                    value={slice.color}
                    onChange={(e) =>
                      updateSlice(index, "color", e.target.value)
                    }
                  />
                </Box>
              </Item>
            </Stack>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WheelOfFortune;
