import mongoose from "mongoose";

const FloorSchema = new mongoose.Schema(
  {
    floor_number: { type: Number, required: true },
    total_rooms: { type: Number, required: true },
    capacity: { type: Number, required: true },
    incharge: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: false }, // Reference to Employee
  },
  { timestamps: true }
);

const Floor = mongoose.model("Floor", FloorSchema);
export default Floor;
