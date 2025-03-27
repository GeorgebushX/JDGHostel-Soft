// import Floor from '../models/Floor.js'
// import Room from '../models/Room.js'
// import Employee from '../models/Employee.js'
// import Student from '../models/Student.js'
// import StudentFee from '../models/Fee.js'
// import Salary from '../models/EmployeeSalary.js'
// import Fee from '../models/Fee.js'


// export const getSummary = async (req, res)=>{
// try {
//     const totalFloors = await Floor.countDocuments()
//     const totalRooms = await Room.countDocuments()
//     const totalEmployees = await Employee.countDocuments()
//     const totalStudents = await Student.countDocuments()
// // total monthly salary
// const totalSalaries = await Employee.aggregate([
//     {$group:{_id:null,totalSalary:{$sum:"$salary"}}}
// ])
// // student admission status

// const studentAppliesForHostel = await Student.distinct('studentid')
// // student approvel status
// const studentStatus = await Student.aggregate([
//     {$group:{
//         status:"$status",
//         count:{$sum:1},
//     }}
// ])
// // counting status
// const AdmissionSummary = {
//     appliedFor :studentAppliesForHostel.length,
//     approved:admissionStatus.find(item =>item.status === "approved")?.count || 0,
//     Rejected:admissionStatus.find(item =>item.status === "rejected")?.count || 0,
//     Pending:admissionStatus.find(item =>item.status === "pending")?.count || 0,
// }

// // Student Fees status

// const studentAppliesForHostelFee = await Student.distinct('admission_id')
// // student approvel status
// const studentFeeStatus = await Fee.aggregate([
//     {$group:{
//         status:"$status",
//         count:{$sum:1},
//     }}
// ])
// // counting status
// const StudentFeesSummary = {
//     appliedFor :studentAppliesForHostelFee.length,
//     paid:studentFeeStatus.find(item =>item.status === "paid")?.count || 0,
//     Pending:studentFeeStatus.find(item =>item.status === "pending")?.count || 0,
// }
// return res.status(200).json({
//     success:true,

//     totalFloors,
//     totalRooms,
//     totalStudents,
//     totalEmployees,
//     totalSalary:totalSalaries[0]?.totalSalary ||0,
//     AdmissionSummary,  
//     StudentFeesSummary  

// })
// } catch (error) {
//     return res.status(500).json({success:false,error:"Dashboard summary error"})
// }    
// }



import Floor from '../models/Floor.js';
import Room from '../models/Room.js';
import Employee from '../models/Employee.js';
import Student from '../models/Student.js';
import Fee from '../models/Fee.js';

export const getSummary = async (req, res) => {
  try {
    // Count total documents
    const totalFloors = await Floor.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalEmployees = await Employee.countDocuments();
    const totalStudents = await Student.countDocuments();

    // Calculate total monthly salary
    const totalSalaries = await Employee.aggregate([
      { $group: { _id: null, totalSalary: { $sum: "$netSalary" } } },
    ]);

    // Student admission status
    const studentAppliesForHostel = await Student.distinct('studentid');

    // Student approval status
    const studentStatus = await Student.aggregate([
      {
        $group: {
          _id: "$status", // Corrected: Use _id instead of status
          count: { $sum: 1 },
        },
      },
    ]);

    // Admission summary
    const AdmissionSummary = {
      appliedFor: studentAppliesForHostel.length,
      approved: studentStatus.find((item) => item._id === "approved")?.count || 0,
      rejected: studentStatus.find((item) => item._id === "rejected")?.count || 0,
      pending: studentStatus.find((item) => item._id === "pending")?.count || 0,
    };

    // Student fees status
    const studentAppliesForHostelFee = await Student.distinct('admission_id');

    // Student fee payment status
    const studentFeeStatus = await Fee.aggregate([
      {
        $group: {
          _id: "$status", // Corrected: Use _id instead of status
          count: { $sum: 1 },
        },
      },
    ]);

    // Student fees summary
    const StudentFeesSummary = {
      appliedFor: studentAppliesForHostelFee.length,
      paid: studentFeeStatus.find((item) => item._id === "paid")?.count || 0,
      pending: studentFeeStatus.find((item) => item._id === "pending")?.count || 0,
    };

    return res.status(200).json({
      success: true,
      totalFloors,
      totalRooms,
      totalStudents,
      totalEmployees,
      totalSalary: totalSalaries[0]?.totalSalary || 0,
      AdmissionSummary,
      StudentFeesSummary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};