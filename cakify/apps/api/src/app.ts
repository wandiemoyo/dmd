import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { registerRoutes } from "./routes";
import { errorHandler } from "./middleware/errorHandler";

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    "/api/webhooks/stripe",
    express.raw({ type: "application/json" })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  registerRoutes(app);
  app.use(errorHandler);

  return app;
};
