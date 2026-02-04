import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occurred:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();



// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import authRoutes from './routes/auth.routes';
// import medicineRoutes from './routes/medicine.routes';
// import categoryRoutes from './routes/category.routes';
// import orderRoutes from './routes/order.routes';
// import userRoutes from './routes/user.routes';
// import reviewRoutes from './routes/review.routes';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/medicines', medicineRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/reviews', reviewRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', message: 'MediStore API is running' });
// });

// // Error handling middleware
// app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Internal Server Error',
//   });
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running on http://localhost:${PORT}`);
//   console.log(`📚 API Documentation available at http://localhost:${PORT}/api`);
// });
