// import User from "../models/User.js";
// import bcrypt from 'bcrypt'

// export const changePassword = async ()=>{
// try {
//     const{userId, oldPassword, newPassword}=req.body;
//     const user = await User.findById({_id:userId})
//     if(!user){
//           return res.status(404).json({success:false,error:"user not found "})
// }
//     const isMathc = await bcrypt.compare(oldPassword, user.password)
//     if(!isMathc){
//              return res.status(404).json({success:false,error:"old password is wrong "})
// } 
    
//  // Hash new password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update user password
//     await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

//     return res.status(200).json({ success: true, message: "Password changed successfully" });

// } catch (error) {
//     return res.status(500).json({success:false,error:"settings error"})
// }
// }



import User from "../models/User.js";
import bcrypt from "bcrypt";

export const changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: "Old password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

    return res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    return res.status(500).json({ success: false, error: "Server error, please try again" });
  }
};
