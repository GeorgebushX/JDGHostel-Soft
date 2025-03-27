import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addEmployee, upload, getEmployees,getEmployeeById,updateEmployee,deleteEmployee } from "../Controllers/employeeCotrller.js";

const router = express.Router();

router.post("/add", authMiddleware, upload, addEmployee);
router.get("/getall", authMiddleware, getEmployees);
router.get("/get/:id", authMiddleware,getEmployeeById);
router.put("/update/:id", upload, authMiddleware,updateEmployee);
router.delete("/delete/:id", authMiddleware, deleteEmployee);
export default router;
