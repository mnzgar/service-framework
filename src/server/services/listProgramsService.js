import fs from "fs";
import { BASE_URL } from "../routes/programsRoutes.js";

const listProgramsService = {
  list: () => {
    return new Promise((resolve, reject) => {
      fs.readdir(BASE_URL, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const fileList = files
              .filter((file) => file.isFile())
              .map((file) => file.name);

          resolve(fileList);
        }
      });
    });
  }
};

export default listProgramsService;
