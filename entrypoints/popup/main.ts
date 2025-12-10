import { AutodartsLigaConfig } from "@/utils/storage";

// Get DOM elements
const toggleEnabled = document.getElementById("toggle-enabled") as HTMLElement;
const inputToken = document.getElementById("input-token") as HTMLInputElement;
const toggleEachDart = document.getElementById("toggle-each-dart") as HTMLElement;
const toggleAllGameData = document.getElementById("toggle-all-game-data") as HTMLElement;
const toggleLocalDebug = document.getElementById("toggle-local-debug") as HTMLElement;

// Load current config
async function loadConfig() {
  const config = await AutodartsLigaConfig.getValue();
  
  // Set enabled toggle
  if (config.enabled) {
    toggleEnabled.classList.add("active");
  } else {
    toggleEnabled.classList.remove("active");
  }

  // Set token
  inputToken.value = config.token || "";

  // Set each dart toggle
  if (config.eachDart) {
    toggleEachDart.classList.add("active");
  } else {
    toggleEachDart.classList.remove("active");
  }

  // Set all game data toggle
  if (config.allGameData) {
    toggleAllGameData.classList.add("active");
  } else {
    toggleAllGameData.classList.remove("active");
  }

  // Set local debug toggle
  if (config.localDebug) {
    toggleLocalDebug.classList.add("active");
  } else {
    toggleLocalDebug.classList.remove("active");
  }
}

// Save config
async function saveConfig() {
  const config = await AutodartsLigaConfig.getValue();
  
  config.enabled = toggleEnabled.classList.contains("active");
  config.token = inputToken.value;
  config.eachDart = toggleEachDart.classList.contains("active");
  config.allGameData = toggleAllGameData.classList.contains("active");
  config.localDebug = toggleLocalDebug.classList.contains("active");

  await AutodartsLigaConfig.setValue(config);
  console.log("[autodarts-liga] Config saved:", config);
}

// Toggle handlers
toggleEnabled.addEventListener("click", async () => {
  toggleEnabled.classList.toggle("active");
  await saveConfig();
});

toggleEachDart.addEventListener("click", async () => {
  toggleEachDart.classList.toggle("active");
  await saveConfig();
});

toggleAllGameData.addEventListener("click", async () => {
  toggleAllGameData.classList.toggle("active");
  await saveConfig();
});

toggleLocalDebug.addEventListener("click", async () => {
  toggleLocalDebug.classList.toggle("active");
  await saveConfig();
});

// Token input handler (debounced)
let tokenTimeout: ReturnType<typeof setTimeout> | null = null;
inputToken.addEventListener("input", () => {
  if (tokenTimeout) {
    clearTimeout(tokenTimeout);
  }
  tokenTimeout = setTimeout(() => {
    saveConfig();
  }, 500);
});

// Load config on popup open
loadConfig();

