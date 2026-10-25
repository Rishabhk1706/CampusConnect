import College from "../models/College.js";

export const getColleges = async (req, res) => {
    try {
        const colleges = await College.find()
            .select("name domain location verified")
            .sort({ name: 1 });

        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch colleges" });
    }
};

export const getCollegeById = async (req, res) => {
    try {
        const college = await College.findById(req.params.id);

        if (!college) {
            return res.status(404).json({ error: "College not found" });
        }

        res.status(200).json(college);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch college" });
    }
};

export const createCollege = async (req, res) => {
    try {
        const newCollege = new College(req.body);
        await newCollege.save();

        res.status(201).json(newCollege);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateCollege = async (req, res) => {
    try {
        const updated = await College.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updated) {
            return res.status(404).json({ error: "College not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCollege = async (req, res) => {
    try {
        const deleted = await College.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "College not found" });
        }

        res.status(200).json({
            message: "College deleted successfully",
            college: deleted,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete college" });
    }
};
