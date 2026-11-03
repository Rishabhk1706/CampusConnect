import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Company from "./models/Company.js";
import Role from "./models/Role.js";

dotenv.config();

const directory = path.dirname(fileURLToPath(import.meta.url));
const companyCsvPath = path.join(directory, "data", "fortune500-2019.csv");

const indianCompanies = [
  "Reliance Industries",
  "Tata Consultancy Services",
  "Infosys",
  "HCL Technologies",
  "Wipro",
  "Tech Mahindra",
  "LTIMindtree",
  "Persistent Systems",
  "Mphasis",
  "Coforge",
  "Oracle Financial Services Software",
  "Tata Elxsi",
  "Zensar Technologies",
  "Cyient",
  "Birlasoft",
  "Sonata Software",
  "Happiest Minds Technologies",
  "Larsen & Toubro",
  "Tata Motors",
  "Tata Steel",
  "Tata Power",
  "Tata Consumer Products",
  "Mahindra & Mahindra",
  "Bajaj Auto",
  "Bajaj Finserv",
  "Maruti Suzuki",
  "Hero MotoCorp",
  "Eicher Motors",
  "Ashok Leyland",
  "Bharat Forge",
  "Hindalco Industries",
  "UltraTech Cement",
  "Grasim Industries",
  "Asian Paints",
  "Berger Paints India",
  "Pidilite Industries",
  "Godrej Consumer Products",
  "Godrej Industries",
  "ITC Limited",
  "Hindustan Unilever",
  "Nestle India",
  "Britannia Industries",
  "Dabur India",
  "Marico",
  "Tata Chemicals",
  "UPL",
  "Indian Oil Corporation",
  "Bharat Petroleum",
  "Hindustan Petroleum",
  "Oil and Natural Gas Corporation",
  "GAIL",
  "NTPC",
  "Power Grid Corporation of India",
  "Coal India",
  "Vedanta",
  "Hindustan Zinc",
  "Steel Authority of India",
  "Siemens India",
  "ABB India",
  "Bosch India",
  "Cummins India",
  "Thermax",
  "Blue Star",
  "Voltas",
  "Havells India",
  "Dixon Technologies",
  "Bharat Electronics",
  "Hindustan Aeronautics",
  "Bharat Heavy Electricals",
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Bajaj Finance",
  "Aditya Birla Capital",
  "Life Insurance Corporation of India",
  "IndusInd Bank",
  "Yes Bank",
  "Avenue Supermarts",
  "Zomato",
  "Swiggy",
  "Flipkart",
  "Paytm",
  "PhonePe",
  "Ola Electric",
  "MakeMyTrip",
  "Jubilant FoodWorks",
  "Apollo Hospitals",
  "Sun Pharmaceutical Industries",
  "Dr. Reddy's Laboratories",
  "Cipla",
  "Divi's Laboratories",
  "Lupin",
  "Biocon",
  "Torrent Pharmaceuticals",
  "Aurobindo Pharma",
  "Max Healthcare",
  "Fortis Healthcare",
];

const roleFamilies = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Web Developer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "Game Developer",
  "Embedded Software Engineer",
  "Platform Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Infrastructure Engineer",
  "Network Engineer",
  "Systems Engineer",
  "Security Engineer",
  "Application Security Engineer",
  "Penetration Tester",
  "Security Analyst",
  "Data Engineer",
  "Data Analyst",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Research Scientist",
  "Business Intelligence Analyst",
  "Database Administrator",
  "Analytics Engineer",
  "Product Manager",
  "Technical Product Manager",
  "Project Manager",
  "Program Manager",
  "Scrum Master",
  "Product Owner",
  "Business Analyst",
  "Business Systems Analyst",
  "Management Consultant",
  "Strategy Analyst",
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Graphic Designer",
  "Visual Designer",
  "UX Researcher",
  "Content Designer",
  "Technical Writer",
  "Quality Assurance Engineer",
  "Software Development Engineer in Test",
  "Test Automation Engineer",
  "Manual Test Engineer",
  "Solutions Architect",
  "Enterprise Architect",
  "Software Architect",
  "Technical Architect",
  "Engineering Manager",
  "Engineering Lead",
  "Technical Lead",
  "Technical Support Engineer",
  "Customer Success Manager",
  "Customer Support Specialist",
  "Account Manager",
  "Sales Representative",
  "Sales Engineer",
  "Business Development Manager",
  "Marketing Manager",
  "Digital Marketing Specialist",
  "Marketing Analyst",
  "Content Strategist",
  "Social Media Manager",
  "Public Relations Specialist",
  "Financial Analyst",
  "Accountant",
  "Auditor",
  "Investment Analyst",
  "Risk Analyst",
  "Human Resources Specialist",
  "Recruiter",
  "Talent Acquisition Specialist",
  "People Operations Manager",
  "Operations Analyst",
  "Operations Manager",
  "Supply Chain Analyst",
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Procurement Specialist",
  "Mechanical Engineer",
  "Electrical Engineer",
  "Electronics Engineer",
  "Civil Engineer",
  "Chemical Engineer",
  "Automotive Engineer",
  "Manufacturing Engineer",
  "Industrial Engineer",
  "Research and Development Engineer",
  "Hardware Engineer",
  "Robotics Engineer",
  "Technical Consultant",
  "Data Privacy Analyst",
];

function parseCsvRow(row) {
  const fields = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < row.length; index += 1) {
    const character = row[index];

    if (character === '"' && row[index + 1] === '"' && quoted) {
      field += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      fields.push(field);
      field = "";
    } else {
      field += character;
    }
  }

  fields.push(field);
  return fields;
}

function normalizeName(name) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}

async function seedOptions() {
  const csv = await readFile(companyCsvPath, "utf8");
  const fortuneCompanies = csv
    .split(/\r?\n/)
    .slice(1, 431)
    .map((row) => parseCsvRow(row)[1])
    .filter(Boolean);
  const companies = [...new Set([...fortuneCompanies, ...indianCompanies])].slice(0, 500);
  const seniorityLevels = ["Intern", "Junior", "Mid-Level", "Senior", "Lead"];
  const roles = roleFamilies.flatMap((role) =>
    seniorityLevels.map((level) => `${level} ${role}`)
  );

  if (companies.length !== 500 || roles.length !== 500) {
    throw new Error(`Expected 500 companies and 500 roles; got ${companies.length} and ${roles.length}.`);
  }

  if (process.argv.includes("--dry-run")) {
    console.log(`Catalog is valid: ${companies.length} companies and ${roles.length} roles.`);
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Company.bulkWrite(
    companies.map((name) => {
      const normalizedName = normalizeName(name);
      return {
        updateOne: {
          filter: { normalizedName },
          update: { $setOnInsert: { name, normalizedName } },
          upsert: true,
        },
      };
    }),
    { ordered: false }
  );

  await Role.bulkWrite(
    roles.map((name) => {
      const normalizedName = normalizeName(name);
      return {
        updateOne: {
          filter: { normalizedName },
          update: { $setOnInsert: { name, normalizedName } },
          upsert: true,
        },
      };
    }),
    { ordered: false }
  );

  const [companyCount, roleCount] = await Promise.all([
    Company.countDocuments(),
    Role.countDocuments(),
  ]);
  console.log(`Catalog ready in MongoDB: ${companyCount} companies and ${roleCount} roles.`);
}

seedOptions()
  .catch((error) => {
    console.error("Failed to seed company and role options:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
