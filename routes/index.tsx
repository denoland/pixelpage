import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import Pixels from "../islands/Pixels.tsx";
import { getGrid } from "../shared/db.ts";
import { Grid } from "../shared/types.ts";

export const handler: Handlers<Grid> = {
  async GET(_req, ctx) {
    const grid = await getGrid();
    return ctx.render(grid);
  },
};

export default function Home(props: PageProps<Grid>) {
  return (
    <>
      <Head>
        <title>pixelpage</title>
        <link rel="icon" type="image/jpg" href="/logo.jpg" />
      </Head>
      <div class="p-4 mx-auto max-w-screen-md flex justify-center">
        <Pixels grid={props.data} />
      </div>
      <div class="p-4 flex justify-evenly gap-8 text-center">
        <a
          href="https://github.com/denoland/pixelpage"
          class="text-blue-500 hover:underline"
        >
          View Source on GitHub
        </a>
        <a
          href="https://deno.com/deploy"
          class="text-blue-500 hover:underline"
        >
          Powered by Deno Deploy
        </a>
      </div>
    </>
  );
}
