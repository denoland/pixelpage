import { Handlers } from "$fresh/server.ts";
import { COLORS, HEIGHT, WIDTH } from "../../shared/constants.ts";
import { updateGrid } from "../../shared/db.ts";

export const handler: Handlers = {
  async POST(req) {
    const [index, color] = await req.json();
    if (typeof index !== "number") {
      return Response.json("invalid index", { status: 400 });
    }
    if (index < 0 || index >= WIDTH * HEIGHT) {
      return Response.json("invalid index", { status: 400 });
    }
    if (!COLORS.includes(color)) {
      return Response.json("invalid color", { status: 400 });
    }

    const versionstamp = await updateGrid(index, color);

    return Response.json(versionstamp);
  },
};
