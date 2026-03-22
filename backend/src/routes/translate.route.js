import { Router } from "express";
import { TranslateController } from "../controllers/translate.controller.js";

const router = Router();

router.post("/translate", TranslateController.create);
router.get("/translations", TranslateController.list);
router.delete("/translations/:id", TranslateController.remove);
router.patch("/translations/:id", TranslateController.update);

export default router;
