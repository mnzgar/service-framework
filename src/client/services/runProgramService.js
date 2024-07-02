import { API_BASE_URL } from "../buttonListeners.js";

const runProgramService = {
  run: async (programName, args, img) => {
    const command = {
      program: programName,
      args: args,
      img: img
    };

    try {
      const response = await fetch(`${API_BASE_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(command)
      });

      if (!response.ok) {
        throw new Error("Failed to run program");
      }
      return response.json();
    } catch (error) {
      throw new Error(`Error running program: ${error.message}`);
    }
  }
}

export default runProgramService;