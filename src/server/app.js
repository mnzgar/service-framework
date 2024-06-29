import express from "express";
import fileUpload from 'express-fileupload';
import programsRoutes from "./routes/programsRoutes.js";

const app = express();

app.use(express.json());

app.use(fileUpload({
  createParentPath: true
}));

app.use("/api", programsRoutes);

export default app;
