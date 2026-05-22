import { Router } from "express";
import {
  createAgenda,
  getAllAgendas,
  getAgendaById,
  updateAgenda,
  deleteAgenda,
} from "../controllers/agendaController";

const router = Router();

router.post("/", createAgenda);
router.get("/", getAllAgendas);
router.get("/:id", getAgendaById);
router.put("/:id", updateAgenda);
router.delete("/:id", deleteAgenda);

export default router;
