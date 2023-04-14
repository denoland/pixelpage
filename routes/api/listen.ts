import { Handlers } from "$fresh/server.ts";
import { getGrid } from "../../shared/db.ts";
import { GridUpdate } from "../../shared/types.ts";

const FULL_UPDATE_INTERVAL = 10_000; // 10 seconds

export const handler: Handlers = {
  GET() {
    const bc = new BroadcastChannel("tiles");
    let timerId: number | undefined;

    const body = new ReadableStream({
      async start(controller) {
        controller.enqueue(`retry: 1000\n\n`);

        bc.onmessage = (e) => {
          const updates = [e.data as GridUpdate];
          controller.enqueue(`data: ${JSON.stringify(updates)}\n\n`);
        };

        async function queueFullUpdate() {
          timerId = undefined;
          try {
            const grid = await getGrid();

            const updates: GridUpdate[] = [];
            for (let i = 0; i < grid.tiles.length; i++) {
              updates.push({
                index: i,
                color: grid.tiles[i],
                versionstamp: grid.versionstamps[i],
              });
            }

            controller.enqueue(`data: ${JSON.stringify(updates)}\n\n`);
          } finally {
            timerId = setTimeout(queueFullUpdate, FULL_UPDATE_INTERVAL);
          }
        }

        await queueFullUpdate();
      },
      cancel() {
        bc.close();
        if (typeof timerId === "number") clearInterval(timerId);
      },
    });

    return new Response(body.pipeThrough(new TextEncoderStream()), {
      headers: {
        "content-type": "text/event-stream",
        "cache-control": "no-cache",
      },
    });
  },
};
