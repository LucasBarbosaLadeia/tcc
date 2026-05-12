import { Router } from "express";
import {
  createAgendamento,
  getAllAgendamentos,
  getAgendamentoById,
  updateAgendamento,
  deleteAgendamento,
} from "../controllers/agendamentoController";

const router = Router();

router.post("/", createAgendamento);
router.get("/", getAllAgendamentos);
router.get("/:id", getAgendamentoById);
router.put("/:id", updateAgendamento);
router.delete("/:id", deleteAgendamento);

export default router;
