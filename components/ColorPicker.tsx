import { Signal } from "@preact/signals";
import { COLORS } from "../shared/constants.ts";

export default function ColorPicker(props: { selected: Signal<number> }) {
  const { selected } = props;
  return (
    <div class="flex gap-8">
      <img src="/logo.jpg" class="w-16" />
      <div class="flex">
        {COLORS.map((color, i) => (
          <button
            onClick={() => selected.value = i}
            class={`w-8 h-8 bg-[${color}] border-4 ${
              selected.value === i ? "border-black" : "border-gray-100"
            }`}
          >
          </button>
        ))}
      </div>
    </div>
  );
}
