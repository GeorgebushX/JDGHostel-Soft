import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
// import StudnetDashboard from "./pages/StudnetDashboard";
import StudentDashboard from "./pages/StudnetDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import FloorList from "./components/Floors/FloorList";
import Roomlist from "./components/room/roomlist";
import EmployeeList from "./components/employee/EmployeeList";
import StudentList from "./components/student/StudentList";
import AddFloor from "./components/Floors/AddFloor";
import UpdateFloor from "./components/Floors/UpdateFloor";
import AddRoom from "./components/room/AddRoom";
import UpdateRoom from "./components/room/UpdateRoom";
import AddEmployee from "./components/employee/AddEmployee";
import ViewEmployee from "./components/employee/ViewEmployee";
import UpdateEmployee from "./components/employee/UpdateEmployee";
import EmployeeSummary from "./components/EmployeeDashboard/EmployeeSummary";
import Home from "./pages/Home";
import AddStudent from "./components/student/AddStudent";
import ViewStudent from "./components/student/ViewStudent";
import UpdateStudent from "./components/student/UpdateStudent";
import FeeList from "./components/StudentFee/FeeList";
import AddFee from "./components/StudentFee/AddFee";
import ViewStudentFee from "./components/StudentFee/ViewStudentFee";
import UpdateStudentFee from "./components/StudentFee/UpdateStudentFee";
import ListEmployeeSalary from "./components/EmployeeSalary/ListEmployeeSalary";
import AddEmployeeSalary from "./components/EmployeeSalary/AddEmployeeSalary";
import VieweEmployeeSalary from "./components/EmployeeSalary/ViewEmployeeSalary";
import UpdateEmployeeSalary from "./components/EmployeeSalary/UpdateEmployeeSalary";
import ViewEmployeeSalary from "./components/EmployeeSalary/ViewEmployeeSalary";
import StudentSummary from "./components/StudentDashboard/StudentSummary";
import StudentSettings from "./components/StudentDashboard/StudentSettings";
import GetList from "./components/Interview/GetList";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        {/* <Route path="/" element={<Navigate to="/admin-dashboard" replace />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/admission" element={<AddStudent />}></Route>
        <Route path="/interview" element={<GetList/>}></Route>

        {/* admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />}></Route>
          {/* employee Salary */}
          <Route
            path="/admin-dashboard/salary-list"
            element={<ListEmployeeSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/add-salary"
            element={<AddEmployeeSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/view-salary/:id"
            element={<VieweEmployeeSalary />}
          ></Route>
          <Route
            path="/admin-dashboard/update-salary/:id"
            element={<UpdateEmployeeSalary />}
          ></Route>
          {/* student fees */}
          <Route path="/admin-dashboard/fee-list" element={<FeeList />}></Route>
          <Route path="/admin-dashboard/addfee" element={<AddFee />}></Route>
          <Route
            path="/admin-dashboard/viewfee/:id"
            element={<ViewStudentFee />}
          ></Route>
          <Route
            path="/admin-dashboard/updatefee/:id"
            element={<UpdateStudentFee />}
          ></Route>

          <Route
            path="/admin-dashboard/employees"
            element={<EmployeeList />}
          ></Route>
          <Route
            path="/admin-dashboard/add-employee"
            element={<AddEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/view-employee/:id"
            element={<ViewEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/update-employee/:id"
            element={<UpdateEmployee />}
          ></Route>
          <Route
            path="/admin-dashboard/students"
            element={<StudentList />}
          ></Route>
          <Route
            path="/admin-dashboard/view-student/:id"
            element={<ViewStudent />}
          ></Route>

          <Route
            path="/admin-dashboard/update-student/:id"
            element={<UpdateStudent />}
          ></Route>

          <Route path="/admin-dashboard/floors" element={<FloorList />}></Route>
          <Route
            path="/admin-dashboard/add-floor"
            element={<AddFloor />}
          ></Route>
          <Route
            path="/admin-dashboard/update-floor/:id"
            element={<UpdateFloor />}
          ></Route>

          <Route path="/admin-dashboard/rooms" element={<Roomlist />}></Route>
          <Route path="/admin-dashboard/add-room" element={<AddRoom />}></Route>
          <Route
            path="/admin-dashboard/update-room/:id"
            element={<UpdateRoom />}
          ></Route>
          <Route
            path="/admin-dashboard/settings"
            element={<StudentSettings />}
          ></Route>
        </Route>

        {/* employee routes */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />}></Route>
          <Route
            path="/employee-dashboard/myprofile/:id"
            element={<ViewEmployee />}
          ></Route>

          <Route
            path="/employee-dashboard/view-salary/:id"
            element={<ViewEmployeeSalary />}
          ></Route>
          <Route
            path="/employee-dashboard/rooms"
            element={<Roomlist />}
          ></Route>
          <Route
            path="/employee-dashboard/update-room/:id"
            element={<UpdateRoom />}
          ></Route>
          <Route
            path="/employee-dashboard/feelist"
            element={<FeeList />}
          ></Route>
          <Route
            path="/employee-dashboard/viewfee/:id"
            element={<ViewStudentFee />}
          ></Route>
          <Route
            path="/employee-dashboard/students"
            element={<StudentList />}
          ></Route>
          <Route
            path="/employee-dashboard/view-student/:id"
            element={<ViewStudent />}
          ></Route>
          <Route
            path="/employee-dashboard/settings"
            element={<StudentSettings />}
          ></Route>
        </Route>

        {/* student routes */}
        <Route
          path="/student-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["student"]}>
                <StudentDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<StudentSummary />}></Route>
          <Route
            path="/student-dashboard/view-student/:id"
            element={<ViewStudent />}
          ></Route>
          <Route
            path="/student-dashboard/viewfee/:id"
            element={<ViewStudentFee />}
          />
          <Route
            path="/student-dashboard/settings"
            element={<StudentSettings />}
          ></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
