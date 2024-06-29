import uploadProgramService from "../services/uploadProgramService.js";

const uploadProgramController = {
  upload: async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length < 2) {
        return res.status(400).json({ error: "Two files are required: one binary file and one JSON file." });
      }

      const { binaryFile, jsonFile } = req.files;
      await uploadProgramService.upload(binaryFile, jsonFile);

      console.log("Files uploaded successfully");
      res.status(201).json({ message: "Files uploaded successfully" });
    } catch (error) {
      console.log("Error uploading files", error);
      res.status(500).json({ error: error.message });
    }
  }
};

export default uploadProgramController;
