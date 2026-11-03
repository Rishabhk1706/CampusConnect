import { randomBytes } from "node:crypto";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import College from "./models/College.js";
import Course from "./models/Course.js";
import Branch from "./models/Branch.js";
import { loginUser } from "./controllers/authController.js";

dotenv.config();

const demoDomain = "campusconnect-demo.edu";
const demoPassword = randomBytes(18).toString("base64url");
const names = [
  "Aarav Sharma", "Ananya Patel", "Vivaan Singh", "Diya Gupta",
  "Aditya Kumar", "Isha Mehta", "Arjun Nair", "Saanvi Reddy",
  "Reyansh Shah", "Aadhya Iyer", "Krishna Verma", "Myra Joshi",
  "Ishaan Das", "Sara Khan", "Atharv Rao", "Pari Malhotra",
  "Kabir Jain", "Kiara Menon", "Rohan Kulkarni", "Meera Bose",
];
const skills = [
  ["JavaScript", "React"],
  ["Python", "Data Structures"],
  ["Java", "Spring Boot"],
  ["HTML", "CSS", "JavaScript"],
  ["C++", "Algorithms"],
];
const interests = [
  ["Web development", "Open source"],
  ["Artificial intelligence", "Data science"],
  ["Cloud computing", "DevOps"],
  ["Mobile development", "UI design"],
  ["Cybersecurity", "Networks"],
];
const normalizeEmail = (year, number) =>
  `student.y${year}.${String(number).padStart(2, "0")}@${demoDomain}`;

async function seedYearStudents() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be configured in Backend/.env.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in Backend/.env to verify login.");
  }

  await mongoose.connect(process.env.MONGO_URI);

  const [college, course] = await Promise.all([
    College.findOne({ domain: demoDomain, verified: true }),
    Course.findOne({ name: "Bachelor of Technology", isActive: true }),
  ]);
  if (!college || !course) {
    throw new Error("Run npm run seed:demo first to create the demo college and course.");
  }

  const branch = await Branch.findOne({
    courseId: course._id,
    code: "CSE",
    isActive: true,
  });
  if (!branch) {
    throw new Error("The demo CSE branch is missing. Run npm run seed:demo first.");
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const students = Array.from({ length: 60 }, (_, index) => {
    const year = Math.floor(index / 20) + 1;
    const number = (index % 20) + 1;
    const yearOffset = year - 1;

    return {
      name: names[(number - 1 + yearOffset * 7) % names.length],
      email: normalizeEmail(year, number),
      password: passwordHash,
      college: college._id,
      course: course._id,
      branch: branch._id,
      year,
      graduationYear: 2027 + (4 - year),
      isVerified: true,
      bio: `Year ${year} computer science student. Demo profile for testing the CampusConnect directory.`,
      skills: skills[(number + yearOffset) % skills.length],
      achievements: [`Completed year ${year} project showcase`],
      internships: year > 1 ? ["CampusConnect demo internship"] : [],
      interests: interests[(number + yearOffset) % interests.length],
      company: year > 1 ? (year === 2 ? "Wipro" : "Tata Consultancy Services") : "",
      role: year > 1 ? "Software Engineer" : "",
    };
  });

  const existingEmails = await User.distinct("email", {
    email: { $in: students.map((student) => student.email) },
  });
  const existingEmailSet = new Set(existingEmails);
  const emailsToCreate = students
    .filter((student) => !existingEmailSet.has(student.email))
    .map((student) => student.email);

  const result = await User.bulkWrite(
    students.map((student) => ({
      updateOne: {
        filter: { email: student.email },
        update: { $setOnInsert: student },
        upsert: true,
      },
    })),
    { ordered: true }
  );

  if (emailsToCreate.length > 0) {
    const firstLoginEmail = emailsToCreate[0];
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
    await loginUser(
      { body: { email: firstLoginEmail, password: demoPassword } },
      response
    );

    if (response.statusCode !== 200 || !response.body?.token) {
      throw new Error(
        `Seeded student login verification failed (${response.statusCode}).`
      );
    }

    console.log(`Login verified for ${firstLoginEmail}.`);
  }

  const [userCount, yearCounts] = await Promise.all([
    User.countDocuments(),
    Promise.all(
      [1, 2, 3].map((year) =>
        User.countDocuments({
          email: new RegExp(`^student\\.y${year}\\.\\d{2}@${demoDomain}$`),
        })
      )
    ),
  ]);

  console.log(`Created ${result.upsertedCount} new demo student accounts.`);
  console.log(`Year 1: ${yearCounts[0]}, Year 2: ${yearCounts[1]}, Year 3: ${yearCounts[2]}.`);
  if (result.upsertedCount > 0) {
    console.log(`Login email pattern: student.y{year}.{01-20}@${demoDomain}`);
    console.log(`Shared password for newly created accounts: ${demoPassword}`);
  } else {
    console.log("All demo student accounts already existed; existing passwords were preserved.");
  }
  console.log(`Total users in database: ${userCount}.`);
}

try {
  await seedYearStudents();
} catch (error) {
  console.error("Failed to seed year-wise demo students:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
