import { Slice } from "./drawingWheel";

export const updateSlice = (
  index: number,
  property: string,
  value: string,
  setSlices: (arg0: (prevSlices: Slice[]) => Slice[]) => void
) => {
  setSlices((prevSlices) => {
    const updatedSlices = prevSlices.map((slice: Slice, i: number) =>
      i === index ? { ...slice, [property]: value } : slice
    );

    // Check if the total percentage is greater than 100
    const totalPercentage = updatedSlices.reduce(
      (sum: number, slice: { chance: number }) => sum + (slice.chance || 0),
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

export const addSlice = (
  setSlices: (arg0: (prevSlices: Slice[]) => Slice[]) => void
) => {
  setSlices((prev: Slice[]) => [
    ...prev,
    {
      label: "",
      chance: 10,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    },
  ]);
};

export const deleteSlice = (
  index: number,
  setSlices: (arg0: (prevSlices: Slice[]) => Slice[]) => void
) => {
  setSlices((prevSlices: Slice[]) => prevSlices.filter((_, i) => i !== index));
};

export const splitPercentageEvenly = (
  slices: Slice[],
  setSlices: (slices: Slice[]) => void
) => {
  setSlices(
    slices.map((slice: Slice) => {
      return {
        ...slice,
        chance: (1 / slices.length) * 100,
      };
    })
  );
};
