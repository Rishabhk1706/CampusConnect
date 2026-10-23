import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

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


app.get("/", (req, res) => {
  res.send("🎉 Welcome to the Campus Connect!");
});

app.listen(PORT, ()=>console.log(`Server started http://localhost:${PORT}`))