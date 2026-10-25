import User from "../models/User.js";
import College from "../models/College.js";
import Course from "../models/Course.js";
import Branch from "../models/Branch.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, college, course, branch, year } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !password ||
      !college ||
      !course ||
      !branch ||
      year == null
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Please enter a valid college email",
      });
    }

    const academicYear = Number(year);

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    const collegeDoc = await College.findOne({
      _id: college,
      verified: true,
    });

    if (!collegeDoc) {
      return res.status(400).json({
        error: "Invalid or unapproved college",
      });
    }

    const emailDomain = normalizedEmail.split("@")[1];

    if (emailDomain !== collegeDoc.domain.toLowerCase()) {
      return res.status(400).json({
        error: "Email domain does not match selected college",
      });
    }

    const courseDoc = await Course.findOne({
      _id: course,
      isActive: true,
    });

    if (!courseDoc) {
      return res.status(400).json({
        error: "Invalid or inactive course",
      });
    }

    const branchDoc = await Branch.findOne({
      _id: branch,
      courseId: courseDoc._id,
      isActive: true,
    });

    if (!branchDoc) {
      return res.status(400).json({
        error: "Invalid branch for selected course",
      });
    }

    if (
      !Number.isInteger(academicYear) ||
      academicYear < 1 ||
      academicYear > courseDoc.durationYears
    ) {
      return res.status(400).json({
        error: "Invalid academic year for selected course",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: collegeDoc._id,
      course: courseDoc._id,
      branch: branchDoc._id,
      year: academicYear,
    });

    await user.save();

    return res.status(201).json({
      message: "Registration successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        year: user.year,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      error: "Registration failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Authentication configuration error",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        course: user.course,
        branch: user.branch,
        year: user.year,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};