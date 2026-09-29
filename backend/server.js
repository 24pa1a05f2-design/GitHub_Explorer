import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import repositoryRoutes from "./routes/repositoryRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "github-project-explorer-api" });
});

app.use("/api/repositories", repositoryRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`GitHub Project Explorer API running on port ${PORT}`);
});
