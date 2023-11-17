export type Slice = {
  label: string;
  chance: number;
  color: string;
};
export const drawWheel = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  slices: Slice[]
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY);

  let startAngle = -Math.PI / 2;

  slices.forEach((slice) => {
    const chance = slice.chance / 100;
    if (isNaN(chance) || chance < 0 || chance > 1) {
      return;
    }

    const endAngle = startAngle + 2 * Math.PI * chance;

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
    ctx.fillStyle = "black";
    const textRotation = startAngle + (endAngle - startAngle) / 2;

    ctx.save();
    ctx.translate(textX, textY);
    ctx.rotate(textRotation);

    ctx.font = "13px sans-serif";
    ctx.textAlign = "center";
    if (slice.chance >= 5) {
      ctx.fillText(slice.label, 0, 0);
    }

    ctx.restore();

    startAngle = endAngle;
  });
};
