import { Router } from "express";
import {
  createUnidade,
  getAllUnidades,
  getUnidadeById,
  updateUnidade,
  deleteUnidade,
} from "../controllers/unidadeController";

const router = Router();

router.post("/", createUnidade);
router.get("/", getAllUnidades);
router.get("/:id", getUnidadeById);
router.put("/:id", updateUnidade);
router.delete("/:id", deleteUnidade);

export default router;
