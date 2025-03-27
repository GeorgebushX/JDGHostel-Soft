

import mongoose from "mongoose";
const employeeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    employeeid: { type: String, required: true, unique: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    maritalStatus: { type: String, enum: ["single", "married"], required: true },
    phone: { type: Number, trim: true },
    room_number: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee", "student"], required: true },
    image: { type: String },
    id_proof: { type: String, required: true },
    salary: { type: Number },
  },
  { timestamps: true }
);

// Virtual field to populate latest salary
employeeSchema.virtual("netSalary", {
  ref: "Salary",
  localField: "_id",
  foreignField: "employeeId",
  justOne: true,
  options: { sort: { createdAt: -1 } }, // Get latest salary record
});

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;