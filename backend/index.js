import express from 'express';
import cors from 'cors';
import connectToDatabase from './DataBase/db.js';
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from 'url'; // Fix for __dirname issue

dotenv.config();

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRouter from './Routes/auth.js';
import floorRouter from './Routes/floor.js';
import roomRouter from './Routes/roomRoute.js';
import employeeRouter from './Routes/employeeRoute.js';
import salaryRoute from './Routes/employeeSalaryRoute.js'
import studentRouter from './Routes/StudentRoute.js';
import FeeRouter from './Routes/feeRoute.js'
import settingsrouter from './Routes/settings.js'
import dashboardrouter from './Routes/dashboard.js'
// Connect to the database
connectToDatabase();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files correctly
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/floor', floorRouter);
app.use('/api/room', roomRouter);
app.use('/api/employee', employeeRouter);
app.use("/api/salary", salaryRoute);
app.use("/api/student", studentRouter);
app.use("/api/fee",FeeRouter)
app.use("/api/settings",settingsrouter)
app.use("/api/dashboard",dashboardrouter)

export const getdata = async(req,res)=>{
  try{
  const data= await getdata.find("https://fake-json-api.mock.beeceptor.com/users" )
  console.log(data)
  }
catch(error){
  return res.status(500).json({success:false, message:error})
}
}

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is Running on port ${PORT}`);
});
