import express from "express";
import uploadProgramController from "../controllers/uploadProgramController.js";
import listProgramsController from "../controllers/listProgramsController.js";
import runProgramController from "../controllers/runProgramController.js";

export const BASE_URL = "src/server/programs/";

const router = express.Router();

router.get("/programs/list", listProgramsController.list);
router.post("/programs/run", runProgramController.run);
router.post("/programs/upload", uploadProgramController.upload);

export default router;
