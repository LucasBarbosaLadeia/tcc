import { Router } from "express";
import {
  createHorario,
  getAllHorarios,
  getHorarioById,
  updateHorario,
  deleteHorario,
} from "../controllers/horarioController";

const router = Router();

router.post("/", createHorario);
router.get("/", getAllHorarios);
router.get("/:id", getHorarioById);
router.put("/:id", updateHorario);
router.delete("/:id", deleteHorario);

export default router;
