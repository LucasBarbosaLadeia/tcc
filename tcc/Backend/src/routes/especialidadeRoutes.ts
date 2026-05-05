import { Router } from "express";
import {
  createEspecialidade,
  getAllEspecialidades,
  getEspecialidadeById,
  updateEspecialidade,
  deleteEspecialidade,
} from "../controllers/especialidadeController";

const router = Router();

router.post("/", createEspecialidade);
router.get("/", getAllEspecialidades);
router.get("/:id", getEspecialidadeById);
router.put("/:id", updateEspecialidade);
router.delete("/:id", deleteEspecialidade);

export default router;
