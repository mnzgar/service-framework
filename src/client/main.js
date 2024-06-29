import "./style.css";
import "./buttonListeners.js";

document.querySelector("#app").innerHTML = `
  <div>
    <header>
      <img src="/vite.svg" class="logo" alt="Vite logo" />
      <h1>Service Framework</h1>
      <img src="/javascript.svg" class="logo vanilla" alt="JavaScript logo" />
    </header>

    <div id="container">
      <div id="card-container">
        <section class="card menu-card">
          <h2>List Programs</h2>
          <button id="list-programs-button">Search</button>
        </section>
        
        <section class="card menu-card">
          <h2>Upload Program</h2>
          <form id="upload-form" class="form">
            <div class="form-group">
              <label for="binaryFile">Binary File:</label>
              <input type="file" id="binary-file" name="binaryFile" required>
            </div>
            <div class="form-group">
              <label for="jsonFile">JSON File:</label>
              <input type="file" id="json-file" name="jsonFile" required>
            </div>
            <button id="upload-program-button" type="submit">Upload</button>
          </form>
        </section>
      </div>
      
      <div id="exec-container" style="display: none;">
        <section class="card menu-card">
          <div id="programs-list"></div>
        </section>
      
        <section class="card exec-card" id="run-card" style="display: none;">
          <h2>Run Program</h2>
          <form id="run-form" class="form">
            <div class="form-group">
              <label for="programName">Program Name:</label>
              <input type="text" id="program-name" name="programName" required disabled>
            </div>
            <div class="form-group">
              <label for="args">Arguments:</label>
              <textarea id="args" name="args"></textarea>
            </div>
            <button id="run-program-button" type="submit">Run</button>
          </form>
          <pre id="run-result"></pre>
        </section>
      </div>
    </div>
    
    <p class="info">
      Programas disponibles para ser ejecutados
    </p>
  </div>
`;
