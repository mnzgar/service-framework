import listProgramsService from "../services/listProgramsService.js";

const listProgramsController = {
  list: async (req, res) => {
    try {
      const result = await listProgramsService.list();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default listProgramsController;
