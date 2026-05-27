"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const unidadeController_1 = require("../controllers/unidadeController");
const router = (0, express_1.Router)();
router.post("/", unidadeController_1.createUnidade);
router.get("/", unidadeController_1.getAllUnidades);
router.get("/:id", unidadeController_1.getUnidadeById);
router.put("/:id", unidadeController_1.updateUnidade);
router.delete("/:id", unidadeController_1.deleteUnidade);
exports.default = router;
//# sourceMappingURL=unidadeRoutes.js.map