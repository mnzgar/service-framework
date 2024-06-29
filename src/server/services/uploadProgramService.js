import { BASE_URL } from "../routes/programsRoutes.js";
import fs from "fs";

const uploadProgramService = {
  upload: (binaryFile, jsonFile) => {
    return new Promise((resolve, reject) => {
      const jsonPath = `${BASE_URL}info/${jsonFile.name}`;
      const binaryPath = `${BASE_URL}${binaryFile.name}`;

      binaryFile.mv(binaryPath, (err) => {
        if (err) {
          return reject(err);
        }

        fs.chmod(binaryPath, 0o755, (chmodErr) => {
          if (chmodErr) {
            return reject(chmodErr);
          }

          jsonFile.mv(jsonPath, (err) => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      });
    });
  }
};

export default uploadProgramService;
