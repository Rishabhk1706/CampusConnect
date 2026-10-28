import User from "../models/User.js";
import College from "../models/College.js";
import Course from "../models/Course.js";
import Branch from "../models/Branch.js";
import Otp from "../models/Otp.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

const OTP_EXPIRY_MINUTES = 5;

// Generate a secure OTP and store only its hash.
const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

// Create and email an OTP.
const createAndSendOtp = async (email, purpose) => {
  const otp = crypto.randomInt(100000, 1000000).toString();
  const hashedOtp = hashOtp(otp);

  // Remove the previous OTP for the same purpose.
  await Otp.deleteOne({ email, purpose });

  await Otp.create({
    email,
    otp: hashedOtp,
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  });

  try {
    await sendEmail(
      email,
      purpose === "registration"
        ? "CampusConnect Email Verification"
        : "CampusConnect Password Reset",
      `Your OTP is ${otp}. It expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share this code with anyone.`
    );
  } catch (error) {
    // Do not leave a usable OTP if email delivery fails.
    await Otp.deleteOne({ email, purpose });
    throw error;
  }
};

export const registerUser = async (req, res) => {
  let createdUser = null;

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
        error: existingUser.isVerified
          ? "Email already exists"
          : "Registration is already pending. Use the resend OTP endpoint.",
      });
    }

    const collegeDoc = await College.findOne({
      _id: college,
      verified: true,
    });

    if (!collegeDoc || !collegeDoc.domain) {
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

    createdUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      college: collegeDoc._id,
      course: courseDoc._id,
      branch: branchDoc._id,
      year: academicYear,
      isVerified: false,
    });

    await createAndSendOtp(normalizedEmail, "registration");

    return res.status(201).json({
      message: "Registration received. Please verify your email using the OTP sent to you.",
      email: normalizedEmail,
    });
  } catch (error) {
    // Clean up only the new user created by this request.
    if (createdUser) {
      await User.deleteOne({ _id: createdUser._id }).catch(() => { });
      await Otp.deleteOne({
        email: createdUser.email,
        purpose: "registration",
      }).catch(() => { });
    }

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
      error: "Registration failed or OTP email could not be sent. Please try again.",
    });
  }
};

// RESEND REGISTRATION OTP

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        error: "No registration found for this email",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: "Email is already verified",
      });
    }

    await createAndSendOtp(normalizedEmail, "registration");

    return res.status(200).json({
      message: "A new verification OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Send OTP error:", error.message);

    return res.status(500).json({
      error: "Could not send OTP",
    });
  }
};

// VERIFY REGISTRATION OTP

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email?.trim() || !/^\d{6}$/.test(String(otp ?? ""))) {
      return res.status(400).json({
        error: "A valid email and six-digit OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "registration",
      expiresAt: { $gt: new Date() },
    }).select("+otp");

    if (!otpRecord) {
      return res.status(400).json({
        error: "OTP is invalid or expired. Please request a new OTP.",
      });
    }

    const submittedHash = hashOtp(String(otp));

    const hashMatches =
      submittedHash.length === otpRecord.otp.length &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(otpRecord.otp, "hex")
      );

    if (!hashMatches) {
      return res.status(400).json({
        error: "Incorrect OTP",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(404).json({
        error: "User not found. Please register again.",
      });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);

    return res.status(500).json({
      error: "OTP verification failed",
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

    if (!user.isVerified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
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

// FORGOT PASSWORD: SEND RESET OTP

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        error: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
      isVerified: true,
    });

    // Use the same response whether the account exists or not.
    // This helps prevent account enumeration.
    if (!user) {
      return res.status(200).json({
        message: "If a verified account exists, password reset instructions will be sent.",
      });
    }

    await createAndSendOtp(normalizedEmail, "password-reset");

    return res.status(200).json({
      message: "If a verified account exists, password reset instructions will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      error: "Could not process password reset request",
    });
  }
};

// RESET PASSWORD USING OTP

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (
      !email?.trim() ||
      !/^\d{6}$/.test(String(otp ?? "")) ||
      !newPassword
    ) {
      return res.status(400).json({
        error: "Email, six-digit OTP, and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: "New password must be at least 8 characters long",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const otpRecord = await Otp.findOne({
      email: normalizedEmail,
      purpose: "password-reset",
      expiresAt: { $gt: new Date() },
    }).select("+otp");

    if (!otpRecord) {
      return res.status(400).json({
        error: "OTP is invalid or expired. Please request a new OTP.",
      });
    }

    const submittedHash = hashOtp(String(otp));

    const hashMatches =
      submittedHash.length === otpRecord.otp.length &&
      crypto.timingSafeEqual(
        Buffer.from(submittedHash, "hex"),
        Buffer.from(otpRecord.otp, "hex")
      );

    if (!hashMatches) {
      return res.status(400).json({
        error: "Incorrect OTP",
      });
    }

    const user = await User.findOne({
      email: normalizedEmail,
      isVerified: true,
    }).select("+password");

    if (!user) {
      await Otp.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        error: "Unable to reset password for this account",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // A successful reset consumes the OTP.
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);

    return res.status(500).json({
      error: "Password reset failed",
    });
  }
};