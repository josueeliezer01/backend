// backend/src/app.js
import express from "express";
import cors from "cors";
import router from "./router.js";
import path from "path";

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(
  "/products",
  express.static(path.join(process.cwd(), "../frontend/public/products"))
);

export default app;
