import Branch from "../models/Branch.js";

export const getBranches = async (req, res) => {
    try {
        const branches = await Branch.find()
            .populate("courseId", "name durationYears")
            .sort({ name: 1 });

        res.status(200).json(branches);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch branches" });
    }
};

export const getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id)
            .populate("courseId", "name durationYears");

        if (!branch) {
            return res.status(404).json({ error: "Branch not found" });
        }

        res.status(200).json(branch);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch branch" });
    }
};

export const createBranch = async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        await newBranch.save();

        const branch = await Branch.findById(newBranch._id)
            .populate("courseId", "name durationYears");

        res.status(201).json(branch);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "This branch code already exists for the selected course",
            });
        }

        res.status(400).json({ error: error.message });
    }
};

export const updateBranch = async (req, res) => {
    try {
        const updated = await Branch.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).populate("courseId", "name durationYears");

        if (!updated) {
            return res.status(404).json({ error: "Branch not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                error: "This branch code already exists for the selected course",
            });
        }

        res.status(400).json({ error: error.message });
    }
};

export const deleteBranch = async (req, res) => {
    try {
        const deleted = await Branch.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Branch not found" });
        }

        res.status(200).json({
            message: "Branch deleted successfully",
            branch: deleted,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete branch" });
    }
};