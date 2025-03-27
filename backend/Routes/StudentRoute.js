import express from "express";
import {
  addAdmission,
  validatePayment,
  verifyPayment,
  getAdmissions,
  getAdmissionById,
  getOneAdmissionById,
  updateAdmission,
  deleteStudent,
} from "../Controllers/StudentController.js";
import { upload } from "../Config/multerConfig.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to add a new admission (with file uploads)
router.post("/add", upload, addAdmission);

// Route to validate payment
router.post("/validate/payment", validatePayment);

// Route to verify payment and send email
router.post("/verify/payment", verifyPayment);

// Get all admissions (protected route)
router.get("/getall", authMiddleware, getAdmissions);

// Get one admission by ID (protected route)
router.get("/get/:id", authMiddleware, getAdmissionById);

// Update admission status by ID (protected route)
router.put("/getone/:id", authMiddleware, getOneAdmissionById);

// Update an admission record (protected route)
router.put("/update/:id", authMiddleware, upload, updateAdmission);

// Delete a student (protected route)
router.delete("/delete/:id", authMiddleware, deleteStudent);

export default router;


// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import { addAdmission, verifyPayment,ValidatePayment, getAdmissions, getAdmissionById,getOneAdmissionById,updateAdmission,deleteStudent } from "../Controllers/StudentController.js";
// import { upload } from "../Config/multerConfig.js";
// const router = express.Router();

// router.post("/add",upload,addAdmission);
// router.post("/order", Order);
// router.post("/validate/payment", ValidatePayment);
// router.post("/verify-payment",authMiddleware, verifyPayment);
// router.get("/getall",authMiddleware, getAdmissions);
// router.get("/get/:id",authMiddleware, getAdmissionById);
// router.put("/getone/:id",authMiddleware, getOneAdmissionById);
// router.put("/update/:id",authMiddleware, updateAdmission);
// router.delete("/delete/:id",authMiddleware, deleteStudent);


// export default router;






// import express from "express";
// import authMiddleware from "../middleware/authMiddleware.js";
// import {
//   addAdmission,
//    validatePayment,
//   verifyPayment,
//   getAdmissions,
//   getAdmissionById,
//   getOneAdmissionById,
//   updateAdmission,
//   deleteStudent
// } from "../Controllers/StudentController.js";
// import { upload } from "../Config/multerConfig.js";

// const router = express.Router();

// // Route to add a new admission (with file uploads)
// router.post("/add",upload, addAdmission);
// router.post("/validate/payment", validatePayment);
// router.post("/verify/payment", verifyPayment);

// // Get all admissions (protected route)
// router.get("/getall", authMiddleware, getAdmissions);

// // Get one admission by ID (protected route)
// router.get("/get/:id", authMiddleware, getAdmissionById);

// // Update admission status by ID (protected route)
// router.put("/getone/:id", authMiddleware, getOneAdmissionById);

// // Update an admission record (protected route)
// router.put("/update/:id", authMiddleware, upload, updateAdmission);

// // Delete a student (protected route)
// router.delete("/delete/:id", authMiddleware, deleteStudent);

// export default router;
