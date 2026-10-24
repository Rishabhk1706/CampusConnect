import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import courseRoutes from "./routes/courseRoutes.js";
import collegeRoutes from "./routes/collegeRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT

app.use(cors());  
app.use(express.json());  

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log(`Connected Successfully`))
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

    app.use("/api/courses", courseRoutes);
    app.use("/api/colleges", collegeRoutes);
    app.use("/api/branches", branchRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Welcome to the Campus Connect!");
});

app.listen(PORT, ()=>console.log(`Server started http://localhost:${PORT}`))