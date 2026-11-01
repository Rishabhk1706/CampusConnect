import Role from "../models/Role.js";

// GET /api/roles?search=java
export const getRoles = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const filter = {};

    if (search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      filter.normalizedName = {
        $regex: escapedSearch,
        $options: "i",
      };
    }

    const roles = await Role.find(filter)
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
  } catch (error) {
    console.error("Get roles error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};


// POST /api/roles
export const addRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    const cleanName = name.trim().replace(/\s+/g, " ");

    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Role name cannot exceed 100 characters",
      });
    }

    const normalizedName = cleanName.toLowerCase();

    const existingRole = await Role.findOne({ normalizedName });

    if (existingRole) {
      return res.status(200).json({
        success: true,
        message: "Role already exists",
        role: existingRole,
      });
    }

    const role = await Role.create({
      name: cleanName,
    });

    return res.status(201).json({
      success: true,
      message: "Role added successfully",
      role,
    });
  } catch (error) {
    // Handle simultaneous attempts to add the same role.
    if (error.code === 11000) {
      const existingRole = await Role.findOne({
        normalizedName: String(req.body.name || "")
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase(),
      });

      if (existingRole) {
        return res.status(200).json({
          success: true,
          message: "Role already exists",
          role: existingRole,
        });
      }
    }

    console.error("Add role error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add role",
    });
  }
};