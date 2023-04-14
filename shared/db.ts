import { Grid } from "./types.ts";
import { HEIGHT, WIDTH } from "./constants.ts";

const db = await Deno.openKv();

export async function updateGrid(
  index: number,
  color: string,
): Promise<string> {
  const res = await db.set(["tiles", index], color);
  const bc = new BroadcastChannel("tiles");
  bc.postMessage({ index, color, versionstamp: res.versionstamp });
  setTimeout(() => bc.close(), 5);
  return res.versionstamp;
}

export async function getGrid(): Promise<Grid> {
  const tiles = new Array(WIDTH * HEIGHT).fill("#FFFFFF");
  const versionstamps = new Array(WIDTH * HEIGHT).fill("");
  for await (const entry of db.list<string>({ prefix: ["tiles"] })) {
    const index = entry.key[1] as number;
    tiles[index] = entry.value;
    versionstamps[index] = entry.versionstamp;
  }
  return { tiles, versionstamps };
}
