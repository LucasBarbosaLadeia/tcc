"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agendamentoController_1 = require("../controllers/agendamentoController");
const router = (0, express_1.Router)();
router.post("/", agendamentoController_1.createAgendamento);
router.get("/", agendamentoController_1.getAllAgendamentos);
router.get("/:id", agendamentoController_1.getAgendamentoById);
router.put("/:id", agendamentoController_1.updateAgendamento);
router.delete("/:id", agendamentoController_1.deleteAgendamento);
exports.default = router;
//# sourceMappingURL=agendamentoRoutes.js.map