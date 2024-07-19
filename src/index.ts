import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.router.js";
import { globalErrorHandler } from "./middleware/error.middleware.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { athleteRouter } from "./routes/athlete.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const authorizedHosts = process.env.AUTHORIZED_HOSTS
    ? process.env.AUTHORIZED_HOSTS.split(",")
    : [];

app.use(
    cors({
        credentials: true,
        origin: authorizedHosts,
    }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use(authMiddleware);
app.use("/api/admin/athlete", athleteRouter);

app.use(globalErrorHandler);

app.listen(port, () =>
    console.log(`${new Date().toLocaleTimeString()} Listening on port ${port}`),
);
