const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

let sillabe = [];
let indice = 0;

const API_KEY = "K87693577088957"; // <-- la tua API key

captureBtn.addEventListener("click", () => cameraInput.click());

cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  textContainer.innerText = "Sto leggendo il testo...";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "ita");
  formData.append("isOverlayRequired", "false");
  formData.append("detectOrientation", "true");
  formData.append("scale", "true");
  formData.append("OCREngine", "2");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    headers: { apikey: API_KEY },
    body: formData
  });

  const data = await res.json();
  const testo = data.ParsedResults?.[0]?.ParsedText?.trim() || "";

  if (!testo) {
    textContainer.innerText = "Non ho trovato testo leggibile.";
    return;
  }

  sillabe = sillabizza(testo);
  indice = 0;
  render();
});

textContainer.addEventListener("click", () => {
  if (!sillabe.length) return;
  indice = (indice + 1) % sillabe.length;
  render();
});

function render() {
  textContainer.innerHTML = "";
  sillabe.forEach((s, i) => {
    const span = document.createElement("span");
    span.textContent = s;
    if (i === indice) {
      span.style.background = "yellow";
      span.style.fontWeight = "bold";
    }
    textContainer.appendChild(span);
  });
}

function sillabizza(testo) {
  const parole = testo.split(/\s+/);
  const out = [];
  parole.forEach(parola => {
    const s = sillabizzaParola(parola);
    s.forEach(x => out.push(x));
    out.push(" ");
  });
  return out;
}

function sillabizzaParola(p) {
  const vocali = "aeiouàèéìòóùAEIOU";
  const s = [];
  let c = "";
  for (let i = 0; i < p.length; i++) {
    c += p[i];
    const v = vocali.includes(p[i]);
    const next = p[i + 1] || "";
    const nextV = vocali.includes(next);
    if (v && (!next || !nextV)) {
      s.push(c);
      c = "";
    }
  }
  if (c) s.push(c);
  return s;
}





