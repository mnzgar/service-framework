import runProgramService from "../services/runProgramService.js";

const runProgramController = {
  run: async (req, res) => {
    try {
      const { program, args } = req.body;
      const result = await runProgramService.run(program, args);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default runProgramController;
