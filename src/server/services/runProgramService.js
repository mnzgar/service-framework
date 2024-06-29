import { exec } from "child_process";
import fs from "fs";
import { BASE_URL } from "../routes/programsRoutes.js";

const IMG_PATH = "public/assets/";

const runProgramService = {
  getRunCommand: (program, args) => {
    return new Promise((resolve, reject) => {
      const jsonPath = `${BASE_URL}info/${program}.json`;
      const execPath = `${BASE_URL}${program}`;

      if (!fs.existsSync(jsonPath) || !fs.existsSync(execPath)) {
        return reject(new Error(`No executable found for program ${program} at path ${execPath} or info at path ${jsonPath}`));
      }

      fs.readFile(jsonPath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          try {
            const jsonContent = JSON.parse(data);

            let finalArgs = args;
            if (args.includes(".png")) {
              const orgImg = `${IMG_PATH}${args.split(" ")[0]}`;
              const destImg = `${IMG_PATH}${args.split(" ")[1]}`;
              finalArgs = `${orgImg} ${destImg}`;
            }

            const command = `${jsonContent.execute}${execPath} ${finalArgs}`;
            resolve(command);
          } catch (error) {
            reject(error);
          }
        }
      });
    });
  },

  run: async (program, args) => {
    try {
      const command = await runProgramService.getRunCommand(program, args);
      return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else if (stderr) {
            reject(new Error(stderr));
          } else {
            try {
              resolve(stdout);
            } catch (parseError) {
              reject(parseError);
            }
          }
        });
      });
    } catch (error) {
      throw new Error(`Error in getRunCommand: ${error.message}`);
    }
  }
};

export default runProgramService;
