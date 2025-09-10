import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.js"
dotenv.config();
const app = express({path:['.env']});
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    console.log("Req recieved on / URL ")
    return res.json({message:"Hello"})
})
app.use('/api/auth',authRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});