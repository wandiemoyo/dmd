import type { Express } from "express";
import { Router } from "express";
import bakerRoutes from "./bakers";
import orderRoutes from "./orders";
import webhookRoutes from "./webhooks";

export const registerRoutes = (app: Express) => {
  const apiRouter = Router();
  apiRouter.use("/bakers", bakerRoutes);
  apiRouter.use("/orders", orderRoutes);
  apiRouter.use("/webhooks", webhookRoutes);

  app.use("/api", apiRouter);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });
};
