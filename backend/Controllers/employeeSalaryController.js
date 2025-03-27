import Salary from "../models/EmployeeSalary.js";
import Employee from "../models/Employee.js";

// ✅ Create Salary (POST)
export const createSalary = async (req, res) => {
  try {
    const { employeeid, month, year, basicSalary, allowances, deductions } = req.body;

    if (!employeeid || !month || !year || basicSalary === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Convert values to numbers
    const basic = parseFloat(basicSalary) || 0;
    const allow = parseFloat(allowances) || 0;
    const deduct = parseFloat(deductions) || 0;
    const netSalary = basic + allow - deduct;

    // Create Salary Record
    const newSalary = new Salary({
      employeeId: employeeid,  // Ensure this matches the schema field
      month,
      year,
      basicSalary: basic,
      allowances: allow,
      deductions: deduct,
      netSalary,
    });

    await newSalary.save();

    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      data: newSalary,
    });
  } catch (error) {
    console.error("Error creating salary:", error);
    res.status(500).json({
      success: false,
      message: "Error creating salary",
      error: error.message,
    });
  }
};
// ✅ Get All Salaries (GET)
export const getAllSalaries = async (req, res) => {
  try {
    // Update the date field before fetching
    await Salary.updateMany({}, { $set: { date: Date.now() } });

    const salaries = await Salary.find()
      .populate({
        path: "employeeId",
        select: "employeeid image name",
      })
      .lean(); // Convert to plain JavaScript object

    if (!salaries.length) {
      return res.status(404).json({ success: false, message: "No salary records found" });
    }

    res.status(200).json({ success: true, data: salaries });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching salary records",
      error: error.message,
    });
  }
};


// // ✅ Get Salary by ID (GET)
// export const getSalaryById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Update the date field before fetching
//     let salary = await Salary.findOneAndUpdate(
//       { _id: id },
//       { $set: { date: Date.now() } },
//       { new: true } // Returns the updated document
//     )
//       .populate({
//         path: "employeeId",
//         select: "employeeid image name",
//       })
//       .lean();

//     if (!salary) {
//       const employee = await Employee.findOne({ userId: id });
//       if (!employee) {
//         return res.status(404).json({
//           success: false,
//           message: "Employee not found",
//         });
//       }
//       salary = await Salary.find({ employeeId: employee._id })
//         .populate({
//           path: "employeeId",
//           select: "employeeid image name",
//         })
//         .lean();
//     }

//     if (!salary || salary.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary record not found",
//       });
//     }

//     res.status(200).json({ success: true, data: salary });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching salary",
//       error: error.message,
//     });
//   }
// };


// ✅ Get Salary by ID (GET)
export const getSalaryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find the salary record by ID
    let salary = await Salary.findOneAndUpdate(
      { _id: id }, // Filter by salary ID
      { $set: { date: Date.now() } }, // Update the date field
      { new: true } // Return the updated document
    )
      .populate({
        path: "employeeId", // Populate the employeeId field
        select: "employeeid image name", // Select specific fields from the Employee model
      })
      .lean(); // Convert to plain JavaScript object

    // If salary record is not found by ID, try finding it by employee ID
    if (!salary || salary.length < 1) {
      const employee = await Employee.findOne({ userId: id }); // Find employee by userId
      console.log(employee)
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      // Find all salary records for the employee
      salary = await Salary.find({ employeeId: employee._id })
        .populate({
          path: "employeeId", // Populate the employeeId field
          select: "employeeid image name", // Select specific fields from the Employee model
        })
        .lean(); // Convert to plain JavaScript object
    }
    console.log(salary)

    // If no salary records are found, return a 404 error
    if (!salary || (Array.isArray(salary) && salary.length === 0)) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    // Return the salary data
    res.status(200).json({ success: true, data: salary });
  } catch (error) {
    console.error("Error fetching salary:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching salary",
      error: error.message,
    });
  }
};

// ✅ Get Salary by ID (GET)
// export const getSalaryById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Update the date field before fetching
//     const salary = await Salary.findByIdAndUpdate(
//       id,
//       { $set: { date: Date.now() } },
//       { new: true } // Returns the updated document
//     )
//       .populate({
//         path: "employeeId",
//         select: "employeeid image name",
//       })
//       .lean();

//     if (!salary) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary record not found",
//       });
//     }

//     res.status(200).json({ success: true, data: salary });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching salary",
//       error: error.message,
//     });
//   }
// };



// ✅ Update Salary (PUT)
export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { basicSalary, allowances, deductions, status } = req.body;

    // Calculate net salary
    const netSalary = basicSalary + allowances - deductions;

    const updatedSalary = await Salary.findByIdAndUpdate(
      id,
      { basicSalary, allowances, deductions, netSalary, status },
      { new: true }
    );

    if (!updatedSalary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      data: updatedSalary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating salary",
      error: error.message,
    });
  }
};

// ✅ Delete Salary (DELETE)
export const deleteSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSalary = await Salary.findByIdAndDelete(id);

    if (!deletedSalary) {
      return res.status(404).json({
        success: false,
        message: "Salary record not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary deleted successfully",
      data: deletedSalary,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting salary",
      error: error.message,
    });
  }
};