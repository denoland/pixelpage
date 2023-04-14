import { Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { Grid, GridUpdate } from "../shared/types.ts";

import ColorPicker from "../components/ColorPicker.tsx";
import PixelGrid from "../components/PixelGrid.tsx";

function applyGameUpdates(signal: Signal<Grid>, updates: GridUpdate[]) {
  const grid = signal.value;
  for (const update of updates) {
    if (grid.versionstamps[update.index] >= update.versionstamp) continue;
    grid.tiles[update.index] = update.color;
    grid.versionstamps[update.index] = update.versionstamp;
  }
  signal.value = { ...grid };
}

export default function Pixels(props: { grid: Grid }) {
  const selected = useSignal(0);
  const grid = useSignal(props.grid);

  useEffect(() => {
    const eventSource = new EventSource("/api/listen");
    eventSource.onmessage = (e) => {
      const updates: GridUpdate[] = JSON.parse(e.data);
      applyGameUpdates(grid, updates);
    };
    return () => eventSource.close();
  }, []);

  async function updateGrid(index: number, color: string) {
    const resp = await fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([index, color]),
    });
    if (!resp.ok) {
      console.error("Failed to update grid");
    }
    const versionstamp: string = await resp.json();
    const update = { index, color, versionstamp };
    applyGameUpdates(grid, [update]);
  }

  return (
    <div class="flex flex-col gap-4">
      <PixelGrid grid={grid} selected={selected} updateGrid={updateGrid} />
      <ColorPicker selected={selected} />
    </div>
  );
}
