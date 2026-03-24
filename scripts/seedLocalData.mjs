import { mkdir, writeFile } from "node:fs/promises";
import { fallbackProsecutors } from "../src/data/fallbackProsecutors.js";

const outputDir = new URL("../data/", import.meta.url);
await mkdir(outputDir, { recursive: true });
await writeFile(
  new URL("../data/prosecutors.seed.json", import.meta.url),
  `${JSON.stringify(fallbackProsecutors, null, 2)}\n`,
);

console.log("Wrote data/prosecutors.seed.json");
