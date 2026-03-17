const getApiBase = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL;
  if (envBase) return envBase;

  const host = window.location.hostname;

  if (host.includes("cloudworkstations.dev")) {
    if (host.startsWith("5173-")) {
      return https://5000-${host.slice(5)};
    }
    return https://5000-${host};
  }

  return "http://127.0.0.1:5000";
};

const API_BASE = getApiBase();

async function post(path, payload, isPdf = false) {
  const response = await fetch(${API_BASE}${path}, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || Request failed (${response.status}));
  }

  return isPdf ? response.blob() : response.json();
}

export const api = {
  generateProposal: (payload) => post("/generate-proposal", payload),
  generateEmail: (payload) => post("/generate-email", payload),
  generateIdeas: (payload) => post("/generate-ideas", payload),
  exportPdf: (payload) => post("/export-pdf", payload, true),
};