"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const horarioController_1 = require("../controllers/horarioController");
const router = (0, express_1.Router)();
router.post("/", horarioController_1.createHorario);
router.get("/", horarioController_1.getAllHorarios);
router.get("/:id", horarioController_1.getHorarioById);
router.put("/:id", horarioController_1.updateHorario);
router.delete("/:id", horarioController_1.deleteHorario);
exports.default = router;
//# sourceMappingURL=horarioRoutes.js.map