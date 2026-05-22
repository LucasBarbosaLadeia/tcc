import { Router } from "express";
import {
  createPaciente,
  getAllPacientes,
  getPacienteById,
  updatePaciente,
  deletePaciente,
} from "../controllers/pacienteController";

const router = Router();

router.post("/", createPaciente);
router.get("/", getAllPacientes);
router.get("/:id", getPacienteById);
router.put("/:id", updatePaciente);
router.delete("/:id", deletePaciente);

export default router;
