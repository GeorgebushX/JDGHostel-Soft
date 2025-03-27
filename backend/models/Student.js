import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   
    name: { type: String, required: true, trim: true },
    studentid: { type: String,unique: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    phonenumber: {
      type: String,
      required: true,
      trim: true,
      // match: /^[6-9]\d{9}$/, // Ensures a 10-digit Indian phone number
    },
    address: { type: String, required: true, trim: true },
    nationality: { type: String, required: true, trim: true },
    aadhaarNumber: {
      type: String,
      required: true,
      unique: true,
      // match: /^\d{12}$/, // Ensures Aadhaar is exactly 12 digits
    },
    course: { type: String, required: true, trim: true },
    guardianNumber: {
      type: String,
      required: true,
      trim: true,
      // match: /^[6-9]\d{9}$/, // Ensures a valid guardian phone number
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    room_number: { type: mongoose.Schema.Types.ObjectId, ref: "Room" }, // Reference to Room model
    role: { type: String, enum: ["admin", "employee", "student"], required: true },
    image: { type: String }, // File path of uploaded image
    id_proof: { type: String, trim: true }, // File path for uploaded id_proof
    admissionFeePaid: { type: Boolean, default: false }, // Track if fee is paid
    admissionForm: { type: String }, // Path to admission form PDF
    receipt: { type: String }, // Path to receipt PDF
  },
  { timestamps: true }
);

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;

