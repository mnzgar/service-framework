import listProgramsService from "./services/listProgramsService.js";
import updateProgramService from "./services/updateProgramService.js";
import runProgramService from "./services/runProgramService.js";

export const API_BASE_URL = "/api/programs";

document.addEventListener("DOMContentLoaded", () => {
  const listProgramsButton = document.querySelector("#list-programs-button");
  const uploadProgramButton = document.querySelector("#upload-program-button");
  const runProgramButton = document.querySelector("#run-program-button");

  const programName = document.querySelector("#program-name");

  if (listProgramsButton) {
    listProgramsButton.addEventListener("click", async () => {
      try {
        const programs = await listProgramsService.list();

        const programsList = document.querySelector("#programs-list");
        programsList.innerHTML = "";
        programs.forEach((program) => {
          const item = document.createElement("p");
          item.textContent = program;
          item.addEventListener("click", () => {
            const execCard = document.querySelector(".exec-card");
            execCard.style.display = "block";
            programName.value = program;
          });
          programsList.appendChild(item);
        });

        const execContainer = document.querySelector("#exec-container");
        execContainer.style.display = "flex";
      } catch (error) {
        console.error("Error listing programs:", error);
        alert("Error listing programs.");
      }
    });
  }

  if (uploadProgramButton) {
    uploadProgramButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const binaryFile = document.querySelector("#binary-file").files[0];
      const jsonFile = document.querySelector("#json-file").files[0];

      try {
        await updateProgramService.update(binaryFile, jsonFile);
        alert("Program uploaded successfully!");
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  if (runProgramButton) {
    runProgramButton.addEventListener("click", async (event) => {
      event.preventDefault();
      const args = document.querySelector("#args").value;

      try {
        const result = await runProgramService.run(programName.value, args);

        const runResult = document.querySelector("#run-result");
        runResult.textContent = result;

        if (args.includes(".png")) {
          const imgContainer = document.createElement("div");
          imgContainer.classList.add("img-container");

          const orgImg = document.createElement("img");
          orgImg.src = `/public/assets/${args.split(" ")[0]}`;
          orgImg.alt = "Image origen";

          const destImg = document.createElement("img");
          destImg.src = `/public/assets/${args.split(" ")[1]}`;
          destImg.alt = "Image destino";

          imgContainer.appendChild(orgImg);
          imgContainer.appendChild(destImg);

          runResult.appendChild(imgContainer);
        }
      } catch (error) {
        console.error("Error running program:", error);
        alert(`Error running program: ${error.message}`);
      }
    });
  }

});