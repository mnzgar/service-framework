import { API_BASE_URL } from "../buttonListeners.js";

const updateProgramService = {
  update: async (binaryFile, jsonFile) => {
    const command = new FormData();
    command.append("binaryFile", binaryFile);
    command.append("jsonFile", jsonFile);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: command
      });

      if (!response.ok && response.status !== 201) {
        throw new Error("Failed to upload program");
      }
      return response.json();
    } catch (error) {
      throw new Error(`Error uploading program: ${error.message}`);
    }
  }
}

export default updateProgramService;