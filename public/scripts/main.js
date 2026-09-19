// OUTPUTS
export const gridContainer = document.getElementById("grid");
export const userList = document.getElementById("usersList");
export const saveFilesModal = document.getElementById("saveFilesModal");
export const saveFilesForm = document.getElementById("formContent");

// INPUTS
export const usernameInput = document.getElementById("username");
export const setUsernameBtn = document.getElementById("setUsername");
export const saveGridBtn = document.getElementById("saveGrid");
export const sendGridBtn = document.getElementById("sendGrid");
export const openSaveListBtn = document.getElementById("openSaveFilesList");
export const closeModal = document.getElementsByClassName("closeModal")[0];
export const loadSaveFileBtn = document.getElementById("loadSaveFile");

// MOUSE TRACKING
let mouseDownLeft = false;
let mouseDownRight = false;
let clientGrid = [];

function throttle(fn, delay) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

const throttledPaint = throttle(({ x, y }, value) => {
  socket.emit("paint_cell", { x, y }, value);
}, 5);

function createBaseGrid(uiElement) {
  let grid = [...Array(32)].map((e) => Array(32));

  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      cell.addEventListener("click", (e) => {
        if (e.button === 0) socket.emit("paint_cell", { x, y }, 1); // if left click used on a cell turn it on
      });

      cell.addEventListener("contextmenu", () => {
        socket.emit("paint_cell", { x, y }, 0); // if right click used on a cell turn it off
      });

      cell.addEventListener("mousemove", () => {
        // if no mouse buttons are down return
        if (!mouseDownLeft && !mouseDownRight) return;

        // else
        const mode = mouseDownLeft ? 1 : 0;

        if (clientGrid[x][y].value === mode) return;

        throttledPaint({ x, y }, mode);
      });

      cell.addEventListener("mousedown", () => {
        // if no mouse buttons are down return
        if (!mouseDownLeft && !mouseDownRight) return;

        //else
        const mode = mouseDownLeft ? 1 : 0;

        if (clientGrid[x][y].value === mode) return;
        throttledPaint({ x, y }, mode);
      });

      uiElement.appendChild(cell);
      grid[x][y] = cell;
    }
  }

  // return a 2DArray containing each DOM Cell Elements
  return grid;
}

function renderUsersList(users, userID) {
  userList.innerHTML = "";
  Object.values(users).forEach((serverUser) => {
    let li = document.createElement("li");

    let displayText = serverUser.username;

    if (serverUser.id == userID) {
      li.style.fontWeight = "bold";
      displayText += " (X)";
    }

    li.innerText = displayText;
    li.style.color = serverUser.color;
    userList.appendChild(li);
  });
}

function renderSaveFilesList(saveFiles) {
  saveFilesForm.innerHTML = "";
  Object.values(saveFiles).forEach((file) => {
    let component = document.createElement("div");

    let inputRadio = document.createElement("input");
    let label = document.createElement("label");

    inputRadio.type = "radio";
    inputRadio.name = "file";
    inputRadio.id = file.id;
    inputRadio.value = file.id;

    label.htmlFor = file.id;
    label.innerHTML = file.name;

    label.appendChild(inputRadio);
    component.appendChild(label);
    saveFilesForm.appendChild(label);
  });
}

function renderGrid(grid) {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      let cell = grid[x][y];
      updateUiCell(x, y, cell.color, cell.value);
    }
  }
}

function updateUiCell(x, y, color, value) {
  let cellElement = grid[x][y];

  if (cellElement) {
    if (value) {
      cellElement.classList.add("on");
      cellElement.style.boxShadow = "0 0 2px 2px " + color;
    } else {
      cellElement.classList.remove("on");
      cellElement.style.boxShadow = "";
    }
  }
}

// Build the emptyGrid
const grid = createBaseGrid(gridContainer);

// Socket handling
const socket = io();

socket.on("init", (serverGrid, saveFiles) => {
  // Clone the serverGrid into clientGrid
  clientGrid = serverGrid;

  // Render the components
  renderGrid(clientGrid);
  renderSaveFilesList(saveFiles);
});

socket.on("update_cell", ({ x, y, color, value }) => {
  clientGrid[x][y].value = value;
  clientGrid[x][y].color = value;
  updateUiCell(x, y, color, value);
});

socket.on("update_user_list", (users) => {
  renderUsersList(users, socket.id);
});

socket.on("update_save_files_list", (saveFiles) => {
  renderSaveFilesList(saveFiles);
});

socket.on("load_grid", (serverGrid) => {
  clientGrid = serverGrid;
  renderGrid(clientGrid);
});

// UI HANDLING

// Handle MOUSE in the gridContainer
gridContainer.addEventListener("mousedown", (e) => {
  if (e.button === 0) mouseDownLeft = true;
  if (e.button === 2) mouseDownRight = true;
});

gridContainer.addEventListener("mouseup", (e) => {
  if (e.button === 0) mouseDownLeft = false;
  if (e.button === 2) mouseDownRight = false;
});

gridContainer.addEventListener("contextmenu", (e) => e.preventDefault());

// When the change username button is clicked
setUsernameBtn.addEventListener("click", () => {
  // Get the value of the username Input
  let newUsername = usernameInput.value.trim();

  // Sanity check
  if (newUsername) {
    socket.emit("update_username", newUsername);
  } else {
    alert("Username is no good baby");
  }
});

// When saveGridBtn is clicked send the save_grid signal to server
saveGridBtn.addEventListener("click", () => {
  socket.emit("save_grid");
});

// Open the modalView
openSaveListBtn.addEventListener("click", () => {
  saveFilesModal.style.display = "block";
});

// Close The modal view
closeModal.addEventListener("click", () => {
  saveFilesModal.style.display = "none";
});

// When the modalView is open and the load button is clicked
loadSaveFileBtn.addEventListener("click", () => {
  // retreive data from the form
  let data = new FormData(saveFilesForm);

  // get the value of the selected radio
  let fileId = "";
  data.forEach((entry) => {
    fileId = entry;
  });

  // Send the chosen fileId to the server
  socket.emit("select_save_file", fileId);
});
