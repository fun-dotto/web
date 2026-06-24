import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const allowedEnvironments = new Set(["dev", "stg", "prd"]);
const environment = process.env.DOTTO_ENV ?? "dev";

if (!allowedEnvironments.has(environment)) {
  throw new Error(
    `Invalid DOTTO_ENV "${environment}". Expected one of: dev, stg, prd.`,
  );
}

const wellKnownDirectory = path.join(process.cwd(), "public", ".well-known");
const source = path.join(
  wellKnownDirectory,
  `apple-app-site-association-${environment}`,
);
const destination = path.join(
  wellKnownDirectory,
  "apple-app-site-association",
);

if (!existsSync(source)) {
  throw new Error(`Missing apple-app-site-association source file: ${source}`);
}

copyFileSync(source, destination);
console.log(`Generated apple-app-site-association for ${environment}.`);
