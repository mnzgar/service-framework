import listProgramsService from "../services/listProgramsService.js";

const listProgramsController = {
  list: async (req, res) => {
    try {
      const result = await listProgramsService.list();
      res.json(result);
    } catch (error) {
      console.error("Error listings programs", error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default listProgramsController;
