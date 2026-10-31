import Company from "../models/Company.js";

// GET /api/companies?search=goo
export const getCompanies = async (req, res) => {
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

    const companies = await Company.find(filter)
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });

  } catch (error) {
    console.error("Get companies error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch companies",
    });
  }
};

// POST /api/companies
export const addCompany = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const cleanName = name.trim().replace(/\s+/g, " ");

    if (cleanName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Company name cannot exceed 100 characters",
      });
    }

    const normalizedName = cleanName.toLowerCase();

    // Check whether the company already exists.
    const existingCompany = await Company.findOne({
      normalizedName,
    });

    if (existingCompany) {
      return res.status(200).json({
        success: true,
        message: "Company already exists",
        company: existingCompany,
      });
    }

    // Create a new company.
    const company = await Company.create({
      name: cleanName,
    });

    return res.status(201).json({
      success: true,
      message: "Company added successfully",
      company,
    });

  } catch (error) {
    // Handles two users adding the same company simultaneously.
    if (error.code === 11000) {
      const existingCompany = await Company.findOne({
        normalizedName: String(req.body.name)
          .trim()
          .replace(/\s+/g, " ")
          .toLowerCase(),
      });

      if (existingCompany) {
        return res.status(200).json({
          success: true,
          message: "Company already exists",
          company: existingCompany,
        });
      }
    }

    console.error("Add company error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add company",
    });
  }
};