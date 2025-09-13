import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import userRoutes from './routes/usersRoutes.js';
import tenantRoutes from './routes/tenantsRoutes.js';
import noteRoutes from './routes/notesRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/users', userRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFound);
app.use(errorHandler);
if(process.env.NODE_ENV !== "production"){
  const PORT = process.env.PORT || 5555;
  server.listen(PORT, ()=> console.log("Server is running on PORT: "+ PORT));
}
app.listen(PORT, console.log(`Server running on port ${PORT}`));