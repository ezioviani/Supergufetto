const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

let sillabe = [];
let indice = 0;

// 1. Scatto foto
captureBtn.addEventListener("click", () => cameraInput.click());

cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  textContainer.innerText = "Sto leggendo il testo...";

  // 2. OCR con OCR.space
  const formData = new FormData();
  formData.append("file", file);
  formData.append("language", "ita");
  formData.append("OCREngine", "2"); // più preciso
  formData.append("scale", "true");

  const res = await fetch("https://api.ocr.space/parse/image", {
    method: "POST",
    body: formData
  });

  const data = await res.json();
  const testo = data.ParsedResults?.[0]?.ParsedText?.trim() || "";

  if (!testo) {
    textContainer.innerText = "Non ho trovato testo leggibile.";
    return;
  }

  // 3. Sillabazione
  sillabe = sillabizza(testo);
  indice = 0;

  // 4. Mostra sillabe
  render();
});

// 5. Tap per avanzare
textContainer.addEventListener("click", () => {
  if (!sillabe.length) return;
  indice = (indice + 1) % sillabe.length;
  render();
});

// --- Funzioni ---

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
    out.push(" "); // spazio come sillaba
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



