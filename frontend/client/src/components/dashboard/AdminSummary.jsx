// import React, { useEffect, useState } from "react";
// import SummaryCard from "./SummaryCard";
// import { FaUsers } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AdminSummary = () => {
//   const [summary, setsummary] = useState(null);
//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const summary = await axios.get(
//           "http://localhost:5000/api/dashboard/summary",{
//             headers:{
//               "Authorization": `Bearer ${localStorage.getItem('token')}`
//             }
//           });
//           setsummary(summary);
//       } catch (error) {
//         if(error.response){
//           toast(error.response.data.error)
//         }
//         console.log(error.message)
//       }
//     };
//     fetchSummary;()
//   }, []);
// if(!summary){
//   return <div>Loading...</div>
// }
//   return (
//     <div className="p-10 ">
//       {/* Dashboard Overview Section */}
//       <h3 className=" fs-4 fw-bold">Dashboard Overview</h3>

//       {/* Management Section */}
//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Hostel Management</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Floors"
//               number={summary.totalFloors}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Rooms"
//               number={summary.totalRooms}
//               color="bg-danger"
//             />
//           </div>

//            <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Students"
//               number={summary.totalStudents}
//               color="bg-danger"
//             />
//           </div>
//            <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Employees"
//               number={summary.totalEmployees}
//               color="bg-danger"
//             />
//           </div>
//            <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Salaries"
//               number={summary.totalSalary}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Employee Management</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Employees"
//               number={50}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Employee Salaries"
//               number={50}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Student Management</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Students"
//               number={50}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Student's fees"
//               number={50}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSummary;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaBuilding,
  FaBed,
  FaUserGraduate,
  FaUserTie,
  FaMoneyBillWave,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/dashboard/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);

  if (!summary) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  // Data for Admission Summary Doughnut Chart
  const admissionData = {
    labels: ["Approved", "Rejected", "Pending"],
    datasets: [
      {
        data: [
          summary.AdmissionSummary.approved,
          summary.AdmissionSummary.rejected,
          summary.AdmissionSummary.pending,
        ],
        backgroundColor: ["#4CAF50", "#F44336", "#FFC107"],
        hoverBackgroundColor: ["#66BB6A", "#EF5350", "#FFD54F"],
      },
    ],
  };

  // Data for Student Fees Summary Bar Chart
  const feesData = {
    labels: ["Paid", "Pending"],
    datasets: [
      {
        label: "Fees Status",
        data: [
          summary.StudentFeesSummary.paid,
          summary.StudentFeesSummary.pending,
        ],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderColor: ["#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container-fluid p-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">
                <FaBuilding /> Total Floors
              </h5>
              <p className="card-text fs-3">{summary.totalFloors}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5 className="card-title">
                <FaBed /> Total Rooms
              </h5>
              <p className="card-text fs-3">{summary.totalRooms}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5 className="card-title">
                <FaUserGraduate /> Total Students
              </h5>
              <p className="card-text fs-3">{summary.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-warning text-white h-100">
            <div className="card-body">
              <h5 className="card-title">
                <FaUserTie /> Total Employees
              </h5>
              <p className="card-text fs-3">{summary.totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h5 className="card-title">
                <FaMoneyBillWave /> Total Salary
              </h5>
              <p className="card-text fs-3">${summary.totalSalary}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphs */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title">Admission Summary</h5>
            </div>
            <div className="card-body">
              <Doughnut data={admissionData} />
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="card-title">Student Fees Summary</h5>
            </div>
            <div className="card-body">
              <Bar
                data={feesData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;

// import React, { useEffect, useState } from "react";
// import SummaryCard from "./SummaryCard";
// import { FaUsers } from "react-icons/fa";
// import axios from "axios";
// import { toast } from "react-toastify";

// const AdminSummary = () => {
//   const [summary, setSummary] = useState(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/dashboard/summary",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );
//         console.log(summary);
//         if (response.data) {
//           setSummary(response.data); // Set the actual data from the response
//         } else {
//           toast.error("Failed to fetch summary data");
//         }
//       } catch (error) {
//         if (error.response) {
//           toast.error(error.response.data.error || "An error occurred");
//         } else {
//           toast.error("Error fetching summary: " + error.message);
//         }
//         console.error(error);
//       }
//     };

//     fetchSummary(); // Correctly invoke the function
//   }, []);

//   if (!summary) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="p-10">
//       {/* Dashboard Overview Section */}
//       <h3 className="fs-4 fw-bold">Dashboard Overview</h3>

//       {/* Management Section */}
//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Hostel Management</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-3 col-md-3">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Floors"
//               number={summary.totalFloors || 0}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-3 col-md-3">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Rooms"
//               number={summary.totalRooms || 0}
//               color="bg-danger"
//             />
//           </div>

//           <div className="col-3 col-md-3">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Students"
//               number={summary.totalStudents || 0}
//               color="bg-danger"
//             />
//           </div>
//           <div className="col-3 col-md-3">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Employees"
//               number={summary.totalEmployees || 0}
//               color="bg-danger"
//             />
//           </div>
//           <div className="col-3 col-md-3">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Monthly Salary"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Student Admission</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Admission"
//               number={summary.totalEmployees || 0}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-6 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Admission Approved"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>
//           <div className="col-6 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Admission Pending"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>

//           <div className="col-12 col-md-6">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Admission Rejected"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>

//       <div className="mt-3">
//         <h4 className="text-center fs-4 fw-bold">Student Fees</h4>
//         <div className="row g-4 mt-3">
//           <div className="col-4 col-md-4">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Fees"
//               number={summary.totalEmployees || 0}
//               color="bg-info"
//             />
//           </div>
//           <div className="col-4 col-md-4">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Fee Paid"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>
//           <div className="col-4 col-md-4">
//             <SummaryCard
//               icon={<FaUsers />}
//               text="Total Fee Pending"
//               number={summary.totalSalary || 0}
//               color="bg-danger"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminSummary;
