import ViteExpress from "vite-express";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on port ${PORT}...`),
);
