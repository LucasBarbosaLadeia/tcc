import { Router } from "express";
import {
  createProfissional,
  getAllProfissionais,
  getProfissionalById,
  updateProfissional,
  deleteProfissional,
} from "../controllers/profissionalController";

const router = Router();

router.post("/", createProfissional);
router.get("/", getAllProfissionais);
router.get("/:id", getProfissionalById);
router.put("/:id", updateProfissional);
router.delete("/:id", deleteProfissional);

export default router;


