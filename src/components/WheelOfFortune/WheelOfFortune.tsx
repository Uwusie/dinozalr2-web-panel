import { useState, useEffect, useRef } from "react";
import { Box, IconButton, Stack, TextField, Button } from "@mui/material";
import AbcIcon from "@mui/icons-material/Abc";
import PercentIcon from "@mui/icons-material/Percent";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import "./style.scss";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";

interface Slice {
  name: string;
  percent: string;
  color: string;
}

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const drawWheel = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY);

      let startAngle = -Math.PI / 2;

      slices.forEach((slice) => {
        const percent = parseFloat(slice.percent) / 100;
        if (isNaN(percent) || percent < 0 || percent > 1) {
          return;
        }

        const endAngle = startAngle + 2 * Math.PI * percent;

        // Calculate the position for the text element
        const textX =
          centerX +
          (radius / 2) * Math.cos(startAngle + (endAngle - startAngle) / 2);
        const textY =
          centerY +
          (radius / 2) * Math.sin(startAngle + (endAngle - startAngle) / 2);

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = slice.color;
        ctx.fill();

        // Draw the slice name inside the slice
        ctx.fillStyle = "black";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(slice.name, textX, textY);

        startAngle = endAngle;
      });
    };

    drawWheel();
  }, [slices]);

  const updateSlice = (index: number, property: string, value: string) => {
    setSlices((prevSlices) =>
      prevSlices.map((slice, i) =>
        i === index ? { ...slice, [property]: value } : slice
      )
    );
  };

  const addSlice = () => {
    setSlices((prev) => [...prev, { name: "", percent: "10%", color: "red" }]);
  };

  const deleteSlice = (index: number) => {
    setSlices((prevSlices) => prevSlices.filter((_, i) => i !== index));
  };

  return (
    <div className="wheelOfFortune-wrapper">
      <div className="wheelOfFortune-wheel">
        <Button
          variant="contained"
          onClick={addSlice}
          disabled={
            slices.reduce((sum, slice) => {
              const percent = parseFloat(slice.percent) || 0;
              return sum + percent;
            }, 0) >= 100
          }
        >
          +
        </Button>
        {slices.length <= 0 ? (
          <>Empty</>
        ) : (
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            style={{ transform: "rotate(-90deg)" }}
          ></canvas>
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
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
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
                    id="input-with-sx"
                    label="Procent szans"
                    variant="standard"
                    value={slice.percent}
                    onChange={(e) =>
                      updateSlice(index, "percent", e.target.value)
                    }
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <ColorLensIcon sx={{ mr: 1, my: 0.5 }} />
                  <TextField
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
