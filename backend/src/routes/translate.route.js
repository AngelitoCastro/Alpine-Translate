import { Router } from "express";
import { TranslateController } from "../controllers/translate.controller.js";

const router = Router();

router.post("/translate", TranslateController.create.bind(TranslateController));
router.get("/translations", TranslateController.list.bind(TranslateController));
router.delete("/translations/:id", TranslateController.remove.bind(TranslateController));
router.patch("/translations/:id", TranslateController.update.bind(TranslateController));

export default router;
