import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
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

companySchema.pre("validate", function () {
  if (this.name) {
    this.normalizedName = this.name
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }
});

const Company = mongoose.model("Company", companySchema);

export default Company;