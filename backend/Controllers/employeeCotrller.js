import Employee from "../models/Employee.js";
import User from "../models/User.js";
import Salary from "../models/EmployeeSalary.js";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Configure multer for file uploads
export const upload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },
  { name: "id_proof", maxCount: 1 },
]);

// ✅ Add Employee Function
export const addEmployee = async (req, res) => {
  try {
    const {
      name, email, employeeid, dob, gender,phone, maritalStatus,
      room_number,password, role
    } = req.body;

    // Validate required fields
    if (!name || !email || !employeeid || !dob || !gender || !phone || !maritalStatus || !room_number || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already registered with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new User
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    // Extract uploaded files and store as relative paths
    const image = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
    const id_proof = req.files?.id_proof ? `/uploads/${req.files.id_proof[0].filename}` : null;

    // Create and save new Employee record
    const newEmployee = new Employee({
      userId: newUser._id,
      name, email, employeeid, dob, gender, maritalStatus,
      room_number, role, image, id_proof,password: hashedPassword // Add this if required
    });

    await newEmployee.save();
    return res.status(201).json({ success: true, message: "Employee added successfully", data: newEmployee });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get All Employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("room_number") // ✅ Fixed syntax
      .populate({
        path: "netSalary",
        select: "netSalary",
      })
      .lean();

    return res.status(200).json({ success: true, data: employees });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// ✅ Get One Employee (by ID)
export const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    let employee = await Employee.findById(id)
      .populate("userId", "-password") // ✅ Exclude password properly
      .populate("room_number")
      .populate({
          path: "netSalary",
          select: "netSalary",
        })
        .lean();

    // If employee by `_id` is not found, check by `userId`
    if (!employee) {
      employee = await Employee.findOne({ userId: id })
        .populate("userId", "-password")
        .populate("room_number")
         .populate({
          path: "netSalary",
          select: "netSalary",
        })
        .lean();
    }

    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    return res.status(200).json({ success: true, data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, employeeid, dob, gender,phone, maritalStatus, room_number, role } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Update fields
    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.employeeid = employeeid || employee.employeeid;
    employee.dob = dob || employee.dob;
    employee.gender = gender || employee.gender;
    employee.maritalStatus = maritalStatus || employee.maritalStatus;
    employee.phone = phone || employee.phone;
    employee.room_number = room_number || employee.room_number;
    employee.role = role || employee.role;

    // Update images if new files uploaded
    if (req.files?.image) {
      employee.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.id_proof) {
      employee.id_proof = `/uploads/${req.files.id_proof[0].filename}`;
    }

    await employee.save();
    return res.status(200).json({ success: true, message: "Employee updated successfully", data: employee });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find employee and delete
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    await User.findByIdAndDelete(employee.userId);

    return res.status(200).json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
