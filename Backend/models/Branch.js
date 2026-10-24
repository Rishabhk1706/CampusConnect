import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        code: {
            type: String,
            required: true,
            uppercase: true,
            trim: true,
        },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Prevent duplicate branch codes within the same course.
branchSchema.index(
    { courseId: 1, code: 1 },
    { unique: true }
);

export default mongoose.model("Branch", branchSchema);