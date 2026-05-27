"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agendaController_1 = require("../controllers/agendaController");
const router = (0, express_1.Router)();
router.post("/", agendaController_1.createAgenda);
router.get("/", agendaController_1.getAllAgendas);
router.get("/:id", agendaController_1.getAgendaById);
router.put("/:id", agendaController_1.updateAgenda);
router.delete("/:id", agendaController_1.deleteAgenda);
exports.default = router;
//# sourceMappingURL=agendaRoutes.js.map