import listProgramsService from "./services/listProgramsService.js";
import updateProgramService from "./services/updateProgramService.js";
import runProgramService from "./services/runProgramService.js";

export const API_BASE_URL = "/api/programs";

document.addEventListener("DOMContentLoaded", () => {
  const listProgramsButton = document.querySelector("#list-programs-button");
  const uploadProgramButton = document.querySelector("#upload-program-button");
  const runProgramButton = document.querySelector("#run-program-button");

  const programName = document.querySelector("#program-name");
  const runResult = document.querySelector("#run-result");

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

            const testImgGroup = document.querySelector("#test-img-group");
            const testImgContainer = document.querySelector("#test-img-container");

            if (program === "test_model.py") {
              testImgGroup.style.display = "grid";
              testImgContainer.innerHTML = '';

              const imagePath = "model_data/test/";
              const imageNames = ['playa_el_medano.jpg', 'playa_las_vistas.jpg', 'playa_los_cristianos.jpg', 'playa_san_telmo.jpg'];
              imageNames.forEach(name => {
                const img = document.createElement('img');
                img.src = `${imagePath}${name}`;
                img.alt = `Imagen ${name}`;
                img.style.width = "90%";
                img.addEventListener('click', () => {
                  document.querySelectorAll('#test-img-container img').forEach(img => img.classList.remove('selected'));
                  img.classList.add('selected');
                });
                testImgContainer.appendChild(img);
              });
            } else {
              testImgGroup.style.display = "none";
              testImgContainer.innerHTML = '';
              runResult.innerHTML = '';
            }
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
      const selectedImg = document.querySelector('#test-img-container img.selected');
      const img = selectedImg ? selectedImg.src : null;
      console.log(img);

      try {
        if (programName.value === "test_model.py" && !selectedImg) {
          throw new Error("Seleccione una imagen");
        }
        if (programName.value.endsWith(".py") && args) {
          throw new Error("Elimine los argumentos");
        } else if (!programName.value.endsWith(".py") && !args) {
          throw new Error("No hay argumentos");
        }

        const result = await runProgramService.run(programName.value, args, img);
        runResult.textContent = result;

        if (args.includes(".png")) {
          const imgContainer = document.createElement("div");
          imgContainer.classList.add("img-container");

          const orgImg = document.createElement("img");
          orgImg.src = `assets/${args.split(" ")[0]}`;
          orgImg.alt = "Image origen";

          const destImg = document.createElement("img");
          destImg.src = `assets/${args.split(" ")[1]}`;
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