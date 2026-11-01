import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    normalizedName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

roleSchema.pre("validate", function () {
  if (this.name) {
    this.normalizedName = this.name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }
});

const Role = mongoose.model("Role", roleSchema);

export default Role;