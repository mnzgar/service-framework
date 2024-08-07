import runProgramService from "../services/runProgramService.js";

const runProgramController = {
  run: async (req, res) => {
    try {
      const { program, args, img } = req.body;
      const result = await runProgramService.run(program, args, img);
      res.json(result);
    } catch (error) {
      console.error("Error runnings program files", error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default runProgramController;
