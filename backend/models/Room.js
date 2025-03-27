


// import mongoose from "mongoose";

// const RoomSchema = new mongoose.Schema(
//   {
//     room_number: {
//       type: String, // Example: "101A"
//       required: true,
//       unique: true, // Ensure no duplicate room numbers
//     },
//     floor_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Floor",
//       required: true,
//     },
//      employeeID: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Employee",
//     },
//       studentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Admission",
//     },
//     capacity: { type: Number, required: true }, // Total capacity of the room
//     occupancy: { type: Number, default: 0 }, // Number of people currently in the room
//     is_available: {
//       type: Boolean,
//       default: function () {
//         return this.occupancy < this.capacity; // Available if occupancy < capacity
//       },
//     },
//   {
//     timestamps: true,
//   }
// );

// // Automatically update `occupancy` and `is_available` before saving
// RoomSchema.pre("save", function (next) {
//   // Count total occupants (students + employees)
//   this.occupancy = (this.students ? this.students.length : 0) + (this.employees ? this.employees.length : 0);

//   // Update availability status
//   this.is_available = this.occupancy < this.capacity;

//   next();
// });

// const Room = mongoose.model("Room", RoomSchema);
// export default Room;


import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    room_number: {
      type: String, // Example: "101A"
      required: true,
      unique: true, // Ensure no duplicate room numbers
    },
    floor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Floor",
      required: true,
    },
    employeeID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],
    studentID: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admission",
      },
    ],
    capacity: { type: Number, required: true }, // Total capacity of the room
    occupancy: { type: Number, default: 0 }, // Number of people currently in the room
    is_available: {
      type: Boolean,
      default: function () {
        return this.occupancy < this.capacity; // Available if occupancy < capacity
      },
    },
  },
  { timestamps: true }
);

// Automatically update `occupancy` and `is_available` before saving
RoomSchema.pre("save", function (next) {
  this.occupancy = (this.studentID?.length || 0) + (this.employeeID?.length || 0);
  this.is_available = this.occupancy < this.capacity;
  next();
});

const Room = mongoose.model("Room", RoomSchema);
export default Room;
