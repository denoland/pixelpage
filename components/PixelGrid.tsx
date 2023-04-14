import { Signal } from "@preact/signals";

import { COLORS, WIDTH } from "../shared/constants.ts";
import { Grid } from "../shared/types.ts";

const PIXEL_SIZE = 24;
const DESKTOP_PIXEL_SIZE = 32;

export default function PixelGrid(
  props: {
    grid: Signal<Grid>;
    selected: Signal<number>;
    updateGrid(index: number, color: string): void;
  },
) {
  const { selected, updateGrid } = props;

  return (
    <div
      class={`grid grid-cols-${WIDTH} w-[${WIDTH * PIXEL_SIZE}px] sm:w-[${
        WIDTH * DESKTOP_PIXEL_SIZE
      }px] border`}
    >
      {props.grid.value.tiles.map((color, i) => (
        <div
          class={`w-[${PIXEL_SIZE}px] h-[${PIXEL_SIZE}px] sm:w-[${DESKTOP_PIXEL_SIZE}px] sm:h-[${DESKTOP_PIXEL_SIZE}px] bg-[${color}]`}
          onClick={() => {
            updateGrid(i, COLORS[selected.value]);
          }}
        >
        </div>
      ))}
    </div>
  );
}
