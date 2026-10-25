import User from "../models/User.js";
import Course from "../models/Course.js";

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("college", "name domain location")
      .populate("course", "name durationYears")
      .populate("branch", "name code");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error.message);
    return res.status(500).json({
      error: "Failed to fetch profile",
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "year",
      "graduationYear",
      "bio",
      "linkedinUrl",
      "githubUrl",
      "leetcodeUrl",
      "codeforcesUrl",
      "skills",
      "achievements",
      "internships",
      "interests",
      "company",
      "role",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "No valid fields provided for update",
      });
    }

    if (updates.name !== undefined) {
      if (
        typeof updates.name !== "string" ||
        !updates.name.trim() ||
        updates.name.trim().length > 100
      ) {
        return res.status(400).json({
          error: "Name must be between 1 and 100 characters",
        });
      }

      updates.name = updates.name.trim();
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    if (updates.year !== undefined) {
      const year = Number(updates.year);

      if (!Number.isInteger(year)) {
        return res.status(400).json({
          error: "Academic year must be an integer",
        });
      }

      const course = await Course.findById(user.course);

      if (
        !course ||
        year < 1 ||
        year > course.durationYears
      ) {
        return res.status(400).json({
          error: "Invalid academic year for your course",
        });
      }

      updates.year = year;
    }

    if (updates.graduationYear !== undefined) {
      const graduationYear = Number(updates.graduationYear);

      if (
        !Number.isInteger(graduationYear) ||
        graduationYear < 2000 ||
        graduationYear > 2110
      ) {
        return res.status(400).json({
          error: "Invalid graduation year",
        });
      }

      updates.graduationYear = graduationYear;
    }

    if (updates.bio !== undefined) {
      if (
        typeof updates.bio !== "string" ||
        updates.bio.length > 500
      ) {
        return res.status(400).json({
          error: "Bio must not exceed 500 characters",
        });
      }
    }

    const arrayFields = [
      "skills",
      "achievements",
      "internships",
      "interests",
    ];

    for (const field of arrayFields) {
      if (updates[field] !== undefined) {
        if (
          !Array.isArray(updates[field]) ||
          !updates[field].every((item) => typeof item === "string")
        ) {
          return res.status(400).json({
            error: `${field} must be an array of strings`,
          });
        }

        updates[field] = updates[field]
          .map((item) => item.trim())
          .filter(Boolean);
      }
    }

    const stringFields = [
      "linkedinUrl",
      "githubUrl",
      "leetcodeUrl",
      "codeforcesUrl",
      "company",
      "role",
    ];

    for (const field of stringFields) {
      if (updates[field] !== undefined) {
        if (typeof updates[field] !== "string") {
          return res.status(400).json({
            error: `${field} must be a string`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    Object.assign(user, updates);
    await user.save();

    const updatedUser = await User.findById(user._id)
      .select("-password")
      .populate("college", "name domain location")
      .populate("course", "name durationYears")
      .populate("branch", "name code");

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: error.message,
      });
    }

    console.error("Update profile error:", error.message);

    return res.status(500).json({
      error: "Failed to update profile",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        "name college course branch year graduationYear bio linkedinUrl githubUrl leetcodeUrl codeforcesUrl skills achievements internships interests company role"
      )
      .populate("college", "name")
      .populate("course", "name")
      .populate("branch", "name code");

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error.message);

    return res.status(500).json({
      error: "Failed to fetch user",
    });
  }
};