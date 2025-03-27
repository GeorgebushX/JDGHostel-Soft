import Floor from "../models/Floor.js";
import Employee from "../models/Employee.js"; // Import Employee model

// Create Floor
export const addFloor = async (req, res) => {
  const { floor_number, total_rooms, capacity } = req.body;
  try {
    const data = await Floor.create({ floor_number, total_rooms, capacity });

    if (data) {
      return res.status(201).json({ success: true, message: "Floor Created Successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Floor creation failed" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Get All Floors
export const getFloors = async (req, res) => {
  try {
    const floors = await Floor.find().populate("incharge", "name email"); // Populate incharge details

    if (!floors.length) {
      return res.status(404).json({ success: false, message: "No floors found" });
    }

    return res.status(200).json({ success: true, data: floors });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Get Floor By ID
export const getFloorById = async (req, res) => {
  const { id } = req.params;
  try {
    const floor = await Floor.findById(id).populate("incharge", "name email");

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    return res.status(200).json({ success: true, data: floor });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Update Floor
export const updateFloor = async (req, res) => {
  const { id } = req.params;
  try {
    const floor = await Floor.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    return res.status(200).json({ success: true, message: "Floor updated successfully", data: floor });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Delete Floor
export const deleteFloor = async (req, res) => {
  const { id } = req.params;
  try {
    const floor = await Floor.findByIdAndDelete(id);

    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    return res.status(200).json({ success: true, message: "Floor deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

// Assign Incharge to Floor
export const assignIncharge = async (req, res) => {
  const { floorId, employeeId } = req.body;

  try {
    // Check if floor exists
    const floor = await Floor.findById(floorId);
    if (!floor) {
      return res.status(404).json({ success: false, message: "Floor not found" });
    }

    // Check if employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }

    // Assign the employee as incharge
    floor.incharge = employeeId;
    await floor.save();

    return res.status(200).json({ success: true, message: "Incharge assigned successfully", data: floor });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
