import { Router } from "express";
import {
  createData,
  getAllDatas,
  getDataById,
  updateData,
  deleteData,
} from "../controllers/dataController";

const router = Router();

router.post("/", createData);
router.get("/", getAllDatas);
router.get("/:id", getDataById);
router.put("/:id", updateData);
router.delete("/:id", deleteData);

export default router;
