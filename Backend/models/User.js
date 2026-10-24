import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    year: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    graduationYear: {
      type: Number,
      required: false,
      min: 2000,
      max: 2110,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    bio: {
        type: String,
        default: "",
        maxlength: 500,
    },

    linkedinUrl: {
        type: String,
        default: "",
    },

    githubUrl: {
        type: String,
        default: "",
    },

    leetcodeUrl: {
        type: String,
        default: "",
    },

    codeforcesUrl: {
        type: String,
        default: "",
    },

    skills: {
        type: [String],
        default: [],
    },

    achievements: {
        type: [String],
        default: [],
    },

    internships: {
        type: [String],
        default: [],
    },

    interests: {
        type: [String],
        default: [],
    },

    company: {
        type: String,
        default: "",
    },

    role: {
        type: String,
        default: "",
    },

  },
  { timestamps: true }
);

studentSchema.index({
  college: 1,
  course: 1,
  branch: 1,
  year: 1,
});

export default mongoose.model("User", studentSchema);