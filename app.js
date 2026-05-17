let recognizer;
let sillabe = [];
let indice = 0;

const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

// 1. Carica modello ML Kit WebAPI (UMD)
(async () => {
  const vision = await visionBundle.FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );

  recognizer = await visionBundle.TextRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/text_recognizer/text_recognizer/float16/1/text_recognizer.task"
    }
  });

  console.log("ML Kit pronto!");
})();

// 2. Scatto foto
captureBtn.addEventListener("click", () => cameraInput.click());

// 3. OCR
cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  textContainer.textContent = "Sto leggendo il testo...";

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const result = recognizer.recognize(img);
    const testo = result.text || "";

    if (!testo.trim()) {
      textContainer.textContent = "Non ho trovato testo leggibile.";
      return;
    }

    sillabe = sillabizza(testo);
    indice = 0;
    render();
  };
});

// 4. Tap per avanzare
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







