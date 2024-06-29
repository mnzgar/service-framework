import { API_BASE_URL } from "../buttonListeners.js";

const listProgramsService = {
  list: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/list`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    } catch (error) {
      throw new Error(`Error listing programs: ${error.message}`);
    }
  }
}

export default listProgramsService;