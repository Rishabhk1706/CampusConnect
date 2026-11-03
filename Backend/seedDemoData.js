import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import College from "./models/College.js";
import Course from "./models/Course.js";
import Branch from "./models/Branch.js";
import Company from "./models/Company.js";
import Role from "./models/Role.js";
import { loginUser } from "./controllers/authController.js";

dotenv.config();

const demoEmail = "demo.student@campusconnect-demo.edu";
const demoPassword = randomBytes(18).toString("base64url");
const normalizeName = (name) => name.trim().replace(/\s+/g, " ").toLowerCase();

async function seedDemoData() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured in Backend/.env.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in Backend/.env to test login.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const college = await College.findOneAndUpdate(
    { domain: "campusconnect-demo.edu" },
    {
      $set: {
        name: "CampusConnect Demo University",
        domain: "campusconnect-demo.edu",
        location: "India (demo data)",
        verified: true,
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  const course = await Course.findOneAndUpdate(
    { name: "Bachelor of Technology" },
    { $set: { name: "Bachelor of Technology", durationYears: 4, isActive: true } },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  const branch = await Branch.findOneAndUpdate(
    { courseId: course._id, code: "CSE" },
    {
      $set: {
        name: "Computer Science and Engineering",
        code: "CSE",
        courseId: course._id,
        isActive: true,
      },
    },
    { returnDocument: "after", upsert: true, runValidators: true }
  );

  const companyName = "Wipro";
  await Company.updateOne(
    { normalizedName: normalizeName(companyName) },
    { $setOnInsert: { name: companyName, normalizedName: normalizeName(companyName) } },
    { upsert: true, runValidators: true }
  );

  const roleName = "Software Engineer";
  await Role.updateOne(
    { normalizedName: normalizeName(roleName) },
    { $setOnInsert: { name: roleName, normalizedName: normalizeName(roleName) } },
    { upsert: true, runValidators: true }
  );

  const passwordHash = await bcrypt.hash(demoPassword, 10);
  await User.findOneAndUpdate(
    { email: demoEmail },
    {
      $set: {
        name: "CampusConnect Demo Student",
        email: demoEmail,
        password: passwordHash,
        college: college._id,
        course: course._id,
        branch: branch._id,
        year: 2,
        graduationYear: 2028,
        isVerified: true,
        bio: "Demo profile for testing CampusConnect.",
        skills: ["JavaScript", "React", "Node.js"],
        achievements: ["CampusConnect demo account"],
        internships: ["Software Engineering Intern"],
        interests: ["Web development", "Cloud computing"],
        company: companyName,
        role: roleName,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  const response = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
  await loginUser({ body: { email: demoEmail, password: demoPassword } }, response);

  if (response.statusCode !== 200 || !response.body?.token) {
    throw new Error(`Demo login verification failed (${response.statusCode}).`);
  }

  const [userCount, collegeCount, courseCount, branchCount, companyCount, roleCount] =
    await Promise.all([
      User.countDocuments(),
      College.countDocuments(),
      Course.countDocuments(),
      Branch.countDocuments(),
      Company.countDocuments(),
      Role.countDocuments(),
    ]);

  console.log("Demo data saved and login verified.");
  console.log(`Login email: ${demoEmail}`);
  console.log(`Login password: ${demoPassword}`);
  console.log(
    `Database counts — users: ${userCount}, colleges: ${collegeCount}, courses: ${courseCount}, branches: ${branchCount}, companies: ${companyCount}, roles: ${roleCount}.`
  );
}

try {
  await seedDemoData();
} catch (error) {
  console.error("Failed to seed demo data:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
