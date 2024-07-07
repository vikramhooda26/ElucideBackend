import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./db/index.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const authorizedHosts = process.env.AUTHORIZED_HOSTS
  ? process.env.AUTHORIZED_HOSTS.split(",")
  : [];

app.use(
  cors({
    origin: authorizedHosts,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  try {
    await prisma.dashapp_keyplatform.createMany({
      data: [
        { platform: "Instagram" },
        { platform: "Facebook" },
        { platform: "X" },
        { platform: "YouTube" },
        { platform: "LinkedIn" },
      ],
    });
    console.log("successfully added status");
  } catch (error) {
    console.error(error);
  }
}

await main();

app.listen(port, () =>
  console.log(`${new Date().toLocaleTimeString()} Listening on port ${port}`),
);
