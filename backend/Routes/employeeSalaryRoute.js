import express from "express";
import {
  createSalary,
  getAllSalaries,
  getSalaryById,
  updateSalary,
  deleteSalary,
} from "../Controllers/employeeSalaryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

// ✅ Create Salary (POST)
router.post("/create", createSalary);

// ✅ Get All Salaries (GET)
router.get("/getall", getAllSalaries);

// ✅ Get Salary by ID (GET)
router.get("/getone/:id", getSalaryById);

// ✅ Update Salary (PUT)
router.put("/update/:id", updateSalary);

// ✅ Delete Salary (DELETE)
router.delete("/delete/:id", deleteSalary);

export default router;