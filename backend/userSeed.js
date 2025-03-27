import User from './models/User.js';
import bcrypt from 'bcrypt';
import connectToDatabase from './DataBase/db.js';

const userRegister = async () => {
    try {
        // Ensure the database is connected
        await connectToDatabase();
        console.log("Connected to Database!");

        // Check if the admin user already exists to prevent duplicates
        const existingUser = await User.findOne({ email: "admin@gmail.com" });
        if (existingUser) {
            console.log("Admin user already exists.");
            return;
        }

        // Hash the password before storing
        const hashPassword = await bcrypt.hash("admin", 10);

        // Manually store user data
        const newUser = new User({
            name: "Admin",
            email: "admin@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        // Save user to the database
        await newUser.save();
        console.log("Admin user created successfully!");
    } catch (error) {
        console.error("Error during user registration:", error);
    }
};

// Call the function to register the user
userRegister();
