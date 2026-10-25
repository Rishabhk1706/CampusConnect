import Course from "../models/Course.js";

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .sort({ name: 1 });

        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch courses" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch course" });
    }
};

export const createCourse = async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();

        res.status(201).json(newCourse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const updated = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updated) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({
            message: "Course deleted successfully",
            course: deleted,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete course" });
    }
};
