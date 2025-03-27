import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  addFloor,
  getFloors,
  getFloorById,
  updateFloor,
  deleteFloor,
  assignIncharge,
} from "../Controllers/floorController.js";

const router = express.Router();

router.post("/add", authMiddleware, addFloor); // Create Floor
router.get("/getall", authMiddleware, getFloors); // Get all Floors
router.get("/get/:id", authMiddleware, getFloorById); // Get Floor by ID
router.put("/update/:id", authMiddleware, updateFloor); // Update Floor
router.delete("/delete/:id", authMiddleware, deleteFloor); // Delete Floor
router.put("/assign-incharge", authMiddleware, assignIncharge); // Assign Incharge

export default router;
