import mongoose from "mongoose";
import express from "express";
import StudentFee from "../models/Fee.js";
import Admission from "../models/Student.js";
import User from "../models/User.js";
import fs from "fs/promises"; // Use fs.promises for async operations
import path from "path";
import pdfkit from "pdfkit";
import Razorpay from "razorpay";
import crypto from "crypto";
import { fileURLToPath } from "url";
import transporter from "../Config/nodemailerConfig.js";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Get Single Student Fee by ID
// export const getFeeById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let fee; 
//     fee= await StudentFee.findById({_id:id})
//       .populate({
//         path: "admission_id",
//         select: "studentid name image room_number",
//         populate: { path: "room_number", select: "room_number" },
//       })
//       .lean();

//     // If no fee is found, attempt to find by admission_id instead
//     if (!fee) {
//       fee = await StudentFee.findOne({ 
// userId: id })
//         .populate({
//           path: "admission_id",
//           select: "studentid name image room_number",
//           populate: { path: "room_number", select: "room_number" },
//         })
//         .lean();
//     }

//     if (!fee) {
//       return res.status(404).json({ success: false, message: "Student fee record not found" });
//     }

//     return res.status(200).json({ success: true, data: fee });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching student fee record",
//       error: error.message,
//     });
//   }
// };
// ✅ Get Single Student Fee by ID
// export const getFeeById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     let fee = await StudentFee.findById(id)
//       .populate({
//         path: "admission_id",
//         select: "studentid name image room_number",
//         populate: { path: "room_number", select: "room_number" },
//       })
//       .lean();

//     // If no fee is found, attempt to find by admission_id instead
//     if (!fee) {
//       fee = await StudentFee.findOne({ userId: id })
//         .populate({
//           path: "admission_id",
//           select: "studentid name image room_number",
//           populate: { path: "room_number", select: "room_number" },
//         })
//         .lean();
//     }

//     if (!fee) {
//       return res.status(404).json({ success: false, message: "Student fee record not found" });
//     }

//     return res.status(200).json({ success: true, data: fee });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching student fee record",
//       error: error.message,
//     });
//   }
// };

  // export const getFeeById = async (req, res) => {
  //   const { id } = req.params;

  //   try {
  //     // Try to find the fee record by ID
  //     let fee = await StudentFee.findById(id)
  //       .populate({
  //         path: "admission_id",
  //         select: "studentid name image room_number",
  //         populate: { path: "room_number", select: "room_number" }, // Populate room_number
  //       })
  //       .lean(); // Convert to plain JavaScript object

  //     // If no fee is found by ID, try finding it by userId
  //     if (!fee) {
  //       const student = await Admission.findOne({ userId: id }); // Find student by userId
  //       if (!student) {
  //         return res.status(404).json({
  //           success: false,
  //           message: "Student not found",
  //         });
  //       }

  //       // Find all fee records for the student
  //       fee = await StudentFee.find({ admission_id: student._id })
  //         .populate({
  //           path: "admission_id",
  //           select: "studentid name image room_number",
  //           populate: { path: "room_number", select: "room_number" }, // Populate room_number
  //         })
  //         .lean(); // Convert to plain JavaScript object
  //     }

  //     // If no fee records are found, return a 404 error
  //     if (!fee || (Array.isArray(fee) && fee.length === 0)) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "Fee record not found",
  //       });
  //     }

  //     // Return the fee data
  //     return res.status(200).json({ success: true, data: fee });
  //   } catch (error) {
  //     console.error("Error fetching fee:", error);
  //     return res.status(500).json({
  //       success: false,
  //       message: "Error fetching fee record",
  //       error: error.message,
  //     });
  //   }
  // };
  export const getFeeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the fee record by ID and update the date field
    let fee = await StudentFee.findOneAndUpdate(
      { _id: id }, // Filter by fee ID
      { $set: { date: Date.now() } }, // Update the date field
      { new: true } // Return the updated document
    )
      .populate({
        path: "admission_id",
        select: "studentid name image room_number",
        populate: { path: "room_number", select: "room_number" }, // Populate room_number
      })
      .lean(); // Convert to plain JavaScript object

    // If no fee record is found by ID, try finding it by student user ID
    if (!fee) {
      const student = await Admission.findOne({ userId: id }); // Find student by userId
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Find all fee records for the student
      fee = await StudentFee.find({ admission_id: student._id })
        .populate({
          path: "admission_id",
          select: "studentid name image room_number",
          populate: { path: "room_number", select: "room_number" }, // Populate room_number
        })
        .lean(); // Convert to plain JavaScript object
    }

    // If no fee records are found, return a 404 error
    if (!fee || (Array.isArray(fee) && fee.length === 0)) {
      return res.status(404).json({
        success: false,
        message: "Fee record not found",
      });
    }

    // Return the fee data
    return res.status(200).json({ success: true, data: fee });
  } catch (error) {
    console.error("Error fetching fee:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching fee record",
      error: error.message,
    });
  }
};


// ✅ Get Student Fee & Handle Payment
export const getStudentFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body; // Manually entered amount

    const studentFee = await StudentFee.findById(id).populate("admission_id");

    if (!studentFee) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }

    const admission = await Admission.findById(studentFee.admission_id);
    if (!admission) return res.status(404).json({ success: false, message: "Admission not found" });

    const user = await User.findById(admission.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (studentFee.paymentMethod === "Cash") {
      studentFee.amountPaid = studentFee.HostelFee;
      studentFee.paymentStatus = "Paid";
      studentFee.dueAmount = 0;
      await studentFee.save();

      await generateReceiptAndSendEmail(user, studentFee);

      return res.status(200).json({
        success: true,
        message: "Payment completed successfully (Cash)",
        data: studentFee,
      });
    } else if (studentFee.paymentMethod === "Online") {
      const order = await razorpay.orders.create({
        amount: amount * 100, // Use the manually entered amount
        currency: "INR",
        receipt: studentFee._id.toString(),
        payment_capture: 1,
      });

      // Store the Razorpay order ID in the student fee record
      studentFee.razorpay_order_id = order.id;
      await studentFee.save();

      console.log("📝 Razorpay Order ID saved in StudentFee:", studentFee.razorpay_order_id);

      return res.status(200).json({
        success: true,
        message: "Proceed with online payment",
        order,
      });
    }
  } catch (error) {
    console.error("Error retrieving student fee:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Validate Payment
export const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    console.log("✅ Received Razorpay Payload:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // ✅ Validate Razorpay Signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error("❌ RAZORPAY_KEY_SECRET is missing");
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    console.log("🔍 Generated HMAC:", generatedSignature);
    console.log("📥 Received Signature:", razorpay_signature);

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid transaction signature" });
    }

    // ✅ Call `verifyPayment`
    await verifyPayment(req, res);

  } catch (error) {
    console.error("❌ Payment Validation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Verify Payment & Update Student Fee Record
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id } = req.body;

    console.log("✅ Received Razorpay Payload:", req.body);

    // ✅ Fetch Payment Details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log("📌 Fetched Payment Details:", payment);

    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }

    let order;
    if (payment.order_id) {
      order = await razorpay.orders.fetch(payment.order_id);
    } else if (razorpay_order_id) {
      order = await razorpay.orders.fetch(razorpay_order_id);
    }

    if (!order || !order.receipt) {
      return res.status(400).json({ success: false, message: "Order receipt not found" });
    }

    // ✅ Find student fee record
    console.log("🔍 Searching for StudentFee with razorpay_order_id:", razorpay_order_id);
    const studentFee = await StudentFee.findOne({ razorpay_order_id });

    if (!studentFee) {
      console.error("⚠️ Student fee record not found for order_id:", razorpay_order_id);
      return res.status(400).json({ success: false, message: "Student fee record not found" });
    }

    console.log("📝 Found StudentFee:", studentFee);

    studentFee.paymentStatus = "Paid";
    studentFee.amountPaid = payment.amount / 100;
    studentFee.dueAmount = studentFee.HostelFee - studentFee.amountPaid;
    await studentFee.save();

    // ✅ Find Admission & User Details
    const admission = await Admission.findOne({ userId: studentFee.admission_id });
    if (!admission) return res.status(404).json({ success: false, message: "Admission record not found" });

    const user = await User.findById(admission.userId);
    if (!user) return res.status(404).json({ success: false, message: "User record not found" });

    // ✅ Generate Receipt & Send Email
    await generateReceiptAndSendEmail(user, studentFee, razorpay_payment_id);

    return res.status(200).json({ success: true, message: "Payment verified and email sent successfully" });

  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Generate PDF Receipt & Send Email
const generateReceiptAndSendEmail = async (user, studentFee, paymentId) => {
  try {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const pdfPath = path.join(uploadDir, `${user._id}_receipt.pdf`);
    const doc = new pdfkit({ size: "A4", margin: 50 });

    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(22).text("JDG Hostel Fee Payment Receipt", { align: "center" }).moveDown(0.5);
    doc.fontSize(14).text(`Student Name: ${user.name}`).moveDown(0.3);
    doc.text(`Email: ${user.email}`).moveDown(0.3);
    doc.text(`Hostel Fee: ₹${studentFee.HostelFee}`).moveDown(0.3);
    doc.text(`Amount Paid: ₹${studentFee.amountPaid}`).moveDown(0.3);
    doc.text(`Transaction ID: ${paymentId}`).moveDown(0.3);
    doc.text(`Payment Status: ${studentFee.paymentStatus}`).moveDown(0.3);
    doc.text(`Date: ${new Date().toLocaleDateString()}`).moveDown(1);

    doc.end();

    // ✅ Send Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "JDG Hostel Fee Payment Confirmation",
      html: `<p>Dear ${user.name},</p><p>Your hostel fee payment of ₹${studentFee.amountPaid} has been successfully processed.</p><p>Attached is your payment receipt.</p>`,
      attachments: [{ path: pdfPath }],
    };

    await transporter.sendMail(mailOptions);
    console.log("📩 Email sent successfully to:", user.email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// ✅ Download Receipt API
export const downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const studentFee = await StudentFee.findById(id).populate("admission_id");
    if (!studentFee) return res.status(404).json({ success: false, message: "Student fee record not found" });

    const admission = await Admission.findById(studentFee.admission_id);
    if (!admission) return res.status(404).json({ success: false, message: "Admission record not found" });

    const user = await User.findById(admission.userId);
    if (!user) return res.status(404).json({ success: false, message: "User record not found" });

    const pdfPath = path.join(__dirname, "../uploads", `${user._id}_receipt.pdf`);
    console.log("📂 Checking for file:", pdfPath);

    // Check if the file exists
    try {
      await fs.access(pdfPath); // Check if the file exists
    } catch (err) {
      return res.status(404).json({ success: false, message: "Receipt not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt_${user._id}.pdf`);

    // Stream the file to the client
    const fileStream = fs.createReadStream(pdfPath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("❌ Error downloading receipt:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * @desc Create a new student fee record
 * @route POST /api/fee
 */
export const createFee = async (req, res) => {
  try {
    const fee = new StudentFee(req.body);
    await fee.save();
    res.status(201).json({ success: true, message: "Student fee created successfully", data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error creating student fee", error: error.message });
  }
};

/**
 * @desc Get all student fees
 * @route GET /api/fee/getall
 */

// ✅ Get All Student Fees
export const getAllFees = async (req, res) => {
  try {
    const fees = await StudentFee.find()
      .populate({
        path: "admission_id",
        select: "studentid image room_number",
        populate: {
          path: "room_number", // Ensure room_number is populated if it's a reference
          select: "room_number", // Fetch room number details
        },
      })
      .lean(); // Convert to plain JavaScript object

    if (!fees.length) {
      return res.status(404).json({ success: false, message: "No student fee records found" });
    }

    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error fetching student fees", 
      error: error.message 
    });
  }
};



/**
 * @desc Get a single student fee by ID
 * @route GET /api/fee/:id
 */
// export const getFeeById = async (req, res) => {
//   try {
//     const fee = await StudentFee.findById(req.params.id).populate("admission_id", "studentid");
//     if (!fee) return res.status(404).json({ success: false, message: "Student fee not found" });

//     res.status(200).json({ success: true, data: fee });
//   } catch (error) {
//     res.status(400).json({ success: false, message: "Invalid student fee ID", error: error.message });
//   }
// };






// ✅ Get Single Student Fee by ID

// export const getFeeById = async (req, res) => {
//   try {
//     const fee = await StudentFee.findById(req.params.id)
//       .populate({
//         path: "admission_id",
//         select: "studentid image room_number",
//         populate: { path: "room_number", select: "room_number" }, // Fetch room number
//       })
//       .lean();

//     if (!fee) {
//       return res.status(404).json({ success: false, message: "Student fee record not found" });
//     }

//     res.status(200).json({ success: true, data: fee });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching student fee record",
//       error: error.message,
//     });
//   }
// };


/**
 * @desc Update a student fee record
 * @route PUT /api/fee/:id
 */
// export const updateFee = async (req, res) => {
//   try {
//     const fee = await StudentFee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
//     if (!fee) return res.status(404).json({ success: false, message: "Student fee not found" });

//     res.status(200).json({ success: true, message: "Student fee updated successfully", data: fee });
//   } catch (error) {
//     res.status(400).json({ success: false, message: "Error updating student fee", error: error.message });
//   }
// };


// ✅ Update Student Fee
export const updateFee = async (req, res) => {
  try {
    const updatedFee = await StudentFee.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedFee) {
      return res.status(404).json({ success: false, message: "Student fee record not found" });
    }

    res.status(200).json({ success: true, message: "Student fee updated successfully", data: updatedFee });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating student fee record",
      error: error.message,
    });
  }
};

/**
 * @desc Delete a student fee record
 * @route DELETE /api/fee/:id
 */
export const deleteFee = async (req, res) => {
  try {
    const fee = await StudentFee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: "Student fee not found" });

    res.status(200).json({ success: true, message: "Student fee deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Error deleting student fee", error: error.message });
  }
};







// // ✅ Verify Payment & Update Student Fee Record
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id } = req.body;

//     // ✅ Fetch Payment Details from Razorpay
//     const payment = await razorpay.payments.fetch(razorpay_payment_id);
//     console.log("📌 Fetched Payment Details:", payment);

//     if (payment.status !== "captured") {
//       return res.status(400).json({ success: false, message: "Payment not successful" });
//     }

//     let order;
//     if (payment.order_id) {
//       order = await razorpay.orders.fetch(payment.order_id);
//     } else if (razorpay_order_id) {
//       order = await razorpay.orders.fetch(razorpay_order_id);
//     }

//     if (!order || !order.receipt) {
//       return res.status(400).json({ success: false, message: "Order receipt not found" });
//     }

//     // ✅ Find student fee record
//     const studentFee = await StudentFee.findOne({ razorpay_order_id });

//     if (!studentFee) {
//       console.error("⚠️ Student fee record not found for order_id:", razorpay_order_id);
//       return res.status(400).json({ success: false, message: "Student fee record not found" });
//     }

//     studentFee.paymentStatus = "Paid";
//     studentFee.amountPaid = payment.amount / 100;
//     studentFee.dueAmount = studentFee.HostelFee - studentFee.amountPaid;
//     await studentFee.save();

//     // ✅ Find Admission & User Details
//     const admission = await Admission.findOne({ userId: studentFee.admission_id });
//     if (!admission) return res.status(404).json({ success: false, message: "Admission record not found" });

//     const user = await User.findById(admission.userId);
//     if (!user) return res.status(404).json({ success: false, message: "User record not found" });

//     // ✅ Generate Receipt & Send Email
//     await generateReceiptAndSendEmail(user, studentFee, razorpay_payment_id);

//     return res.status(200).json({ success: true, message: "Payment verified and email sent successfully" });

//   } catch (error) {
//     console.error("❌ Error verifying payment:", error);
//     res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };