// Legge il testo OCR passato dallo Shortcut
const params = new URLSearchParams(window.location.search);
const ocrText = params.get("ocr");

if (ocrText) {
    const testo = decodeURIComponent(ocrText);
    document.getElementById("textContainer").innerText = testo;

    // Se vuoi far partire subito la sillabazione:
    if (typeof sillabizzaTesto === "function") {
        const sillabe = sillabizzaTesto(testo);
        // Qui chiami la tua funzione che mostra il karaoke
        // esempio:
        // mostraKaraoke(sillabe);
    }
}
const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

let sillabe = [];
let index = 0;

captureBtn.onclick = () => cameraInput.click();

cameraInput.onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  textContainer.innerHTML = "⏳ SuperGufetto sta leggendo la pagina...";

  try {
    const { data: { text } } = await Tesseract.recognize(file, 'ita');
    sillabe = sillabizzaTesto(text);
    index = 0;
    if (sillabe.length === 0) {
      textContainer.innerHTML = "Non ho trovato testo leggibile. Prova a rifare la foto più da vicino 😊";
      return;
    }
    mostraTesto();
  } catch (err) {
    console.error(err);
    textContainer.innerHTML = "C'è stato un problema nel leggere il testo. Riprova 😉";
  }
};

function mostraTesto() {
  textContainer.innerHTML = "";

  sillabe.forEach((s, i) => {
    const span = document.createElement("span");
    span.className = "sillaba" + (i === index ? " attiva" : "");
    span.textContent = s;
    textContainer.appendChild(span);
    textContainer.append(" ");
  });
}

document.body.addEventListener("click", (e) => {
  if (e.target === captureBtn || e.target === cameraInput) return;
  if (sillabe.length === 0) return;

  index++;
  if (index >= sillabe.length) {
    index = 0;
    if (navigator.vibrate) navigator.vibrate(120);
  }
  mostraTesto();
});
