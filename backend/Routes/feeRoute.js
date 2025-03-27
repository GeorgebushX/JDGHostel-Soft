import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {

  getFeeById,
  getStudentFee,
  validatePayment,
  downloadReceipt,
  createFee,
  getAllFees,
  updateFee,
  deleteFee,

} from "../Controllers/feeController.js";

const router = express.Router();

router.post("/create", createFee);
router.get("/getall", getAllFees);
// ✅ Get Single Student Fee by ID
router.get("/getone/:id", getFeeById);

// ✅ Get Student Fee & Handle Payment
router.post("/payment/:id/pay", getStudentFee);

// ✅ Validate Payment
router.post("/validate-payment", validatePayment);

// ✅ Download Receipt
router.get("/download/receipt/:id", downloadReceipt);
router.put("/update/:id", updateFee);
router.delete("/delete/:id", deleteFee);

export default router;





