import { Router } from "express";
import { supabase } from "../lib/supabase";
import { BakerService } from "../services/bakerService";

const router = Router();
const bakerService = new BakerService(supabase);

router.get("/", async (_req, res, next) => {
  try {
    const bakers = await bakerService.listBakers();
    res.json(bakers);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const baker = await bakerService.getBaker(req.params.id);
    res.json(baker);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/cakes", async (req, res, next) => {
  try {
    const cakes = await bakerService.getBakerCakes(req.params.id);
    res.json(cakes);
  } catch (error) {
    next(error);
  }
});

export default router;
