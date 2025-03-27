import Room from "../models/Room.js";
import Floor from "../models/Floor.js";
import Admission from "../models/Student.js";
import Employee from "../models/Employee.js";

// Create a room and assign a floor
export const createRoom = async (req, res) => {
    try {
        const { room_number, floor_id, capacity } = req.body;

        // Check if floor exists
        const floorExists = await Floor.findById(floor_id);
        if (!floorExists) {
            return res.status(404).json({ success: false, message: "Invalid floor ID. Floor does not exist." });
        }

        // Create room
        const newRoom = await Room.create({ room_number, floor_id, capacity });

        return res.status(201).json({
            success: true,
            message: "Room successfully created",
            data: newRoom
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
    }
};

// // Get all rooms with floor details
// export const getAllRooms = async (req, res) => {
//     try {
//         const rooms = await Room.find().populate("floor_id", "floor_number total_rooms capacity");

//         return res.status(200).json({
//             success: true,
//             message: "Rooms retrieved successfully",
//             data: rooms
//         });
//     } catch (error) {
//         return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
//     }
// };


// export const getAllRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find()
//       .populate("floor_id", "floor_number total_rooms capacity")
//       .populate({
//         path: "employeeID",
//         select: "employeeid name image",
//       })
//       .populate({
//         path: "studentID",
//         select: "studentid name image",
//       })
//       .lean(); // Ensuring data is plain JSON

//     console.log("Fetched Rooms:", JSON.stringify(rooms, null, 2)); // Debugging log

//     return res.status(200).json({
//       success: true,
//       message: "Rooms retrieved successfully",
//       data: rooms,
//     });
//   } catch (error) {
//     console.error("Error fetching rooms:", error); // Log errors if any
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };



export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("floor_id", "floor_number total_rooms capacity")
      .lean(); // Convert to plain JSON for easier manipulation

    // Fetch employees and students assigned to rooms
    const employees = await Employee.find().select("employeeid name image room_number").lean();
    const students = await Admission.find().populate("userId", "name image").select("studentid room_number").lean();

    // Create a map for employees and students based on their room numbers
    const employeeMap = employees.reduce((acc, emp) => {
      if (emp.room_number) {
        acc[emp.room_number] = acc[emp.room_number] || [];
        acc[emp.room_number].push({
          id: emp.employeeid,
          name: emp.name,
          image: emp.image,
        });
      }
      return acc;
    }, {});

    const studentMap = students.reduce((acc, stu) => {
      if (stu.room_number) {
        acc[stu.room_number] = acc[stu.room_number] || [];
        acc[stu.room_number].push({
          id: stu.studentid,
          name: stu.userId?.name || "Unknown",
          image: stu.userId?.image || null,
        });
      }
      return acc;
    }, {});

    // Update room data to include assigned employees, students, and availability
    const updatedRooms = rooms.map((room) => {
      const assignedEmployees = employeeMap[room._id] || [];
      const assignedStudents = studentMap[room._id] || [];
      const totalOccupants = assignedEmployees.length + assignedStudents.length;
      const isAvailable = totalOccupants < (room.capacity || 0);

      return {
        ...room,
        employees: assignedEmployees,
        students: assignedStudents,
        occupancy: totalOccupants,
        is_available: isAvailable,
      };
    });

    console.log("Fetched Updated Rooms:", JSON.stringify(updatedRooms, null, 2));

    return res.status(200).json({
      success: true,
      message: "Rooms retrieved successfully",
      data: updatedRooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};





// export const getAllRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find()
//       .populate("floor_id", "floor_number total_rooms capacity")
//       .populate({
//         path: "employeeID",
//         select: "employeeid name image",
//       })
//       .populate({
//         path: "studentID",
//         select: "studentid name image",
//       })
//       .lean(); // Convert to plain JSON for easier manipulation

//     // Update room availability based on occupancy & capacity
//     const updatedRooms = rooms.map((room) => {
//       const totalOccupants = (room.studentID?.length || 0) + (room.employeeID?.length || 0);
//       const isAvailable = totalOccupants < room.capacity;

//       return {
//         ...room,
//         occupancy: totalOccupants,
//         is_available: isAvailable,
//       };
//     });

//     console.log("Fetched Updated Rooms:", JSON.stringify(updatedRooms, null, 2));

//     return res.status(200).json({
//       success: true,
//       message: "Rooms retrieved successfully",
//       data: updatedRooms,
//     });
//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || "Internal Server Error",
//     });
//   }
// };



// Get rooms by floor
export const getRoomsByFloor = async (req, res) => {
    const { floorId } = req.params;
    try {
        const rooms = await Room.find({ floor_id: floorId });

        if (!rooms.length) {
            return res.status(404).json({ success: false, message: "No rooms found for this floor" });
        }

        return res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single room by ID
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate("floor_id");
        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }
        return res.status(200).json({ success: true, data: room });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Update a room
export const updateRoom = async (req, res) => {
    const { id } = req.params;
    const { floor_id, student_id, employees_id } = req.body;

    try {
        // Validate Floor ID if provided
        if (floor_id) {
            const floorExists = await Floor.findById(floor_id);
            if (!floorExists) {
                return res.status(404).json({ success: false, message: "Invalid floor ID" });
            }
        }

        // Validate and Fetch Student Name
        let studentName = null;
        if (student_id) {
            const student = await Admission.findById(student_id).select("name");
            if (!student) {
                return res.status(404).json({ success: false, message: "Invalid student ID" });
            }
            studentName = student.name;
        }

        // Validate and Fetch Employee Name
        let employeeName = null;
        if (employees_id) {
            const employee = await Employee.findById(employees_id).select("name");
            if (!employee) {
                return res.status(404).json({ success: false, message: "Invalid employee ID" });
            }
            employeeName = employee.name;
        }

        // Update the room
        const updatedRoom = await Room.findByIdAndUpdate(
            id,
            { ...req.body, student: studentName, employee: employeeName }, // Update with names
            { new: true, runValidators: true }
        ).populate("floor_id"); // Populate floor details

        if (!updatedRoom) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Room updated successfully", 
            data: updatedRoom 
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



// Delete a room
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        return res.status(200).json({ success: true, message: "Room deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
