const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    // Extracting user details from the request body
    const {
      name,
      email,
      password,
      confirmPassword,
      accountType,
      totalMonthlyBudget,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !accountType ||
      !totalMonthlyBudget
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let finalAccountType = "User";
    if (accountType === "Admin") {
      if (adminCode !== process.env.ADMIN_CODE) {
        return res.status(403).json({
          success: false,
          message: "Invalid admin code",
        });
      }
      finalAccountType = "Admin";
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      accountType: finalAccountType,
      totalMonthlyBudget,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        accountType: newUser.accountType,
      },
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "72h" }
    );

    // Respond with success message and token
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
