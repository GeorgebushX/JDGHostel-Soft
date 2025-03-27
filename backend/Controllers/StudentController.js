
import Admission from "../models/Student.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import pdfkit from "pdfkit";
import Razorpay from "razorpay";
import crypto from "crypto";
import transporter from "../Config/nodemailerConfig.js";
import dotenv from "dotenv";

dotenv.config();

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const razorpay = new Razorpay({
  key_id:process.env.RAZORPAY_KEY_ID,
  key_secret:process.env.RAZORPAY_KEY_SECRET,
});
// console.log(razorpay)

// ✅ Add Admission
export const addAdmission = async (req, res) => {
  try {
    const {
      name,
      dob,
      gender,
      email,
      phonenumber,
      address,
      nationality,
      aadhaarNumber,
      course,
      guardianNumber,
      role,
      password,
    } = req.body;

    if (
      !name ||
      !dob ||
      !gender ||
      !email ||
      !phonenumber ||
      !address ||
      !nationality ||
      !aadhaarNumber ||
      !course ||
      !guardianNumber ||
      !role ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // ✅ Validate gender input
    const normalizedGender = gender.toLowerCase();
    if (!["male", "female", "other"].includes(normalizedGender)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gender value" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already registered with this email" });
    }

   // ✅ Store plain password before hashing
    const plainPassword = password;
    // console.log(plainPassword);
    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);


    // ✅ Create user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    const image = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
    const id_proof = req.files?.id_proof ? `/uploads/${req.files.id_proof[0].filename}` : null;

    const newAdmission = new Admission({
      userId: newUser._id,
      name,
      dob,
      gender,
      email,
      phonenumber,
      address,
      nationality,
      aadhaarNumber,
      course,
      guardianNumber,
      role,
      image,
      id_proof,
   
    });

    await newAdmission.save();
// ✅ Generate PDF Admission Form with Better Formatting
const pdfPath = path.join(uploadDir, `${newUser._id}_admission.pdf`);
const doc = new pdfkit({ size: "A4", margin: 50 });

doc.pipe(fs.createWriteStream(pdfPath));

// ✅ Title
doc
  .fontSize(22)
  .font("Helvetica-Bold")
  .text("JDG Hostel Management System", { align: "center" })
  .moveDown(0.5);

// ✅ Address Below Title
doc
  .fontSize(14)
  .font("Helvetica")
  .text("Visuvasampatti Village, Maganurpatti Post, Uthangarai Taluk, Krishnagiri District, Tamil Nadu - 635307", { align: "center" })
  .moveDown(1);

// ✅ Add Student Photo (if available)
if (image) {
  const imagePath = path.join(process.cwd(), "public", image);
  if (fs.existsSync(imagePath)) {
    doc.image(imagePath, 400, 150, { width: 120, height: 120 });
  }
}

// ✅ Admission Form Fields
doc
  .moveDown(1)
  .fontSize(16)
  .font("Helvetica-Bold")
  .text("Admission Form", { underline: true })
  .moveDown(1);

doc
  .fontSize(14)
  .font("Helvetica")
  .text(`Name: ${name}`)
  .moveDown(0.3)
  .text(`Date of Birth: ${new Date(dob).toLocaleDateString()}`)
  .moveDown(0.3)
  .text(`Gender: ${gender}`)
  .moveDown(0.3)
  .text(`Email: ${email}`)
  .moveDown(0.3)
  .text(`Phone Number: ${phonenumber}`)
  .moveDown(0.3)
  .text(`Address: ${address}`)
  .moveDown(0.3)
  .text(`Nationality: ${nationality}`)
  .moveDown(0.3)
  .text(`Aadhaar Number: ${aadhaarNumber}`)
  .moveDown(0.3)
  .text(`Course: ${course}`)
  .moveDown(0.3)
  .text(`Guardian Number: ${guardianNumber}`)
  .moveDown(0.3)
  .text(`Role: ${role}`)
  .moveDown(1);

// ✅ Current Date
const currentDate = new Date().toLocaleDateString();
doc
  .fontSize(14)
  .text(`Date: ${currentDate}`, { align: "left" })
  .moveDown(2);

// ✅ Signature Field
doc
  .fontSize(14)
  .text("Signature: ____________________", { align: "left" })
  .moveDown(1);

doc.end();


    // ✅ Create Razorpay Order for ₹200
    const order = await razorpay.orders.create({
      amount: 20000, // ₹200 in paise
      currency: "INR",
      receipt: newUser._id.toString(),
      payment_capture: 1,
    });

        // ✅ Store plainPassword in memory for later use
    global.tempPasswords = global.tempPasswords || {};
    global.tempPasswords[newUser._id] = plainPassword;

    return res.status(201).json({
      success: true,
      message: "Admission created successfully. Proceed to payment.",
      order,
      data: newAdmission,
    });
  } catch (error) {
    console.error("Error adding admission:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


// ✅ Validate Payment
export const validatePayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // console.log("Payment details:", razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // Validate signature
    const sha = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Transaction verification failed!" });
    }

    // ✅ Call verifyPayment after successful validation
    await verifyPayment(req, res);
  } catch (error) {
    console.error("Payment Validation Error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

import mongoose from "mongoose"; // ✅ Ensure mongoose is imported
// ✅ Verify Payment & Send Email
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id } = req.body;

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    // console.log("Fetched Payment Details:", payment);
  
    if (payment.status !== "captured") {
      return res.status(400).json({ success: false, message: "Payment not successful" });
    }
       let order;
    // ✅ Use `payment.order_id` if available, else use `razorpay_order_id`
    if (payment.order_id) {
      order = await razorpay.orders.fetch(payment.order_id);
    } else if (razorpay_order_id) {
      order = await razorpay.orders.fetch(razorpay_order_id);
    }

    if (!order || !order.receipt) {
      return res.status(400).json({ success: false, message: "Order receipt not found" });
    }


      // ✅ Convert receipt (userId) to ObjectId for MongoDB query
    const userId = new mongoose.Types.ObjectId(order.receipt);
    // console.log("Payment Receipt (should be userId):", userId);

    // ✅ Find admission details using userId
    const admission = await Admission.findOne({ userId });

    // console.log("Admission found:", admission);

    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    // Mark admission fee as paid
    admission.admissionFeePaid = true;
    await admission.save();

    // Fetch user details
    const user = await User.findById(admission.userId);
    const pdfPath = path.join(uploadDir, `${user._id}_admission.pdf`);
   // ✅ Retrieve the original plain password from memory
    const plainPassword = global.tempPasswords?.[user._id] || "Password retrieval error";
    console.log("Sending Plain Password:", plainPassword);
    // ✅ Send Confirmation Email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: admission.email,
      subject: "Admission Confirmation & Payment Receipt",
      html: `
        <p>Dear ${admission.name},</p>
        <p>Congratulations! Your admission has been successfully confirmed.</p>
        <p><strong>Login Credentials:</strong></p>
        <p>Email: ${admission.email}</p>
        <p>Password: <strong>${plainPassword}</strong>
        <p><strong>Payment Details:</strong></p>
        <p>Amount Paid: ₹200</p>
        <p>Transaction ID: ${razorpay_payment_id}</p>
        <p>Attached is your admission form.</p>
        <p>Best Regards, <br> JDG Hostel Managements & Team</p>`,
      attachments: [{ path: pdfPath }],
    };

    await transporter.sendMail(mailOptions);
    
 // ✅ Remove stored plainPassword after sending email
    // delete global.tempPasswords[user._id];

    return res.status(200).json({ success: true, message: "Payment verified and email sent successfully" });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// ✅ Get All Admissions
export const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().populate("room_number")
    .populate("userId", { password: 0 });
    return res.status(200).json({ success: true, data: admissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


// ✅ Get One Admission (by ID)
export const getAdmissionById = async (req, res) => {
  const { id } = req.params;

  try {
    let admission = await Admission.findById(id)
      .populate("userId", "-password") // Exclude password field
      .populate("room_number", "room_number"); // Correct population syntax

    if (!admission) {
      admission = await Admission.findOne({ userId: id })
        .populate("userId", "-password")
        .populate("room_number", "room_number");
    }

    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    return res.status(200).json({ success: true, data: admission });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const getOneAdmissionById = async (req,res)=>{
try {
  const {id}=req.params;
  const admission = await Admission.findByIdAndUpdate({_id:id},{status:req.body.status})
   if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }
    return res.status(200).json({success:true})
} catch (error) {
   return res.status(500).json({ success: false, message: "Server error", error: error.message });
}
}

// update admission

export const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const {
 studentid,name, dob, gender, email, phonenumber, address, nationality,password,
      aadhaarNumber, course, guardianNumber, status, room_number, role, admissionFeePaid
    } = req.body;

    // Check if Admission exists
    const admission = await Admission.findById(id);
    if (!admission) {
      return res.status(404).json({ success: false, message: "Admission not found" });
    }

    // Ensure email & Aadhaar are unique (if changed)
    if (email && email !== admission.email) {
      const emailExists = await Admission.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: "Email already in use" });
      }
    }

    if (aadhaarNumber && aadhaarNumber !== admission.aadhaarNumber) {
      const aadhaarExists = await Admission.findOne({ aadhaarNumber });
      if (aadhaarExists) {
        return res.status(400).json({ success: false, message: "Aadhaar number already in use" });
      }
    }

    // Validate room_number ObjectId (if provided)
    if (room_number && !mongoose.Types.ObjectId.isValid(room_number)) {
      return res.status(400).json({ success: false, message: "Invalid room number ID" });
    }

    // Update fields
    admission.studentid = studentid || admission.studentid;
    admission.name = name || admission.name;
    admission.dob = dob ? new Date(dob) : admission.dob;
    admission.gender = gender || admission.gender;
    admission.email = email || admission.email;
    admission.phonenumber = phonenumber || admission.phonenumber;
    admission.address = address || admission.address;
    admission.nationality = nationality || admission.nationality;
    admission.aadhaarNumber = aadhaarNumber || admission.aadhaarNumber;
    admission.course = course || admission.course;
    admission.guardianNumber = guardianNumber || admission.guardianNumber;
    admission.status = status || admission.status;
    admission.room_number = room_number || admission.room_number;
    admission.role = role || admission.role;
    admission.admissionFeePaid = admissionFeePaid !== undefined ? admissionFeePaid : admission.admissionFeePaid;

    // Handle file uploads
    if (req.files?.image) {
      admission.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.id_proof) {
      admission.id_proof = `/uploads/${req.files.id_proof[0].filename}`;
    }

    await admission.save();
    return res.status(200).json({ success: true, message: "Admission updated successfully", data: admission });
  } catch (error) {
    console.error("Error updating admission:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



// ✅ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find student and delete
    const student = await Admission.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "student not found" });
    }

    await User.findByIdAndDelete(student.userId);

    return res.status(200).json({ success: true, message: "student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};


