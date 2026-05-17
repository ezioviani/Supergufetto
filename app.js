const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

captureBtn.addEventListener("click", () => {
  cameraInput.click();
});

cameraInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  textContainer.innerText = "Sto leggendo il testo...";

  const imageUrl = URL.createObjectURL(file);

  try {
    const result = await Tesseract.recognize(imageUrl, "ita", {
      logger: m => console.log(m)
    });

    const testo = result.data.text.trim();
    if (!testo) {
      textContainer.innerText = "Non ho trovato testo leggibile nell'immagine.";
      return;
    }

    // Mostra il testo riconosciuto
    textContainer.innerText = testo;

    // Se hai una funzione di sillabazione, puoi chiamarla qui:
    // if (typeof sillabizzaTesto === "function") {
    //   const sillabe = sillabizzaTesto(testo);
    //   // qui fai partire il tuo “karaoke”
    // }

  } catch (err) {
    console.error(err);
    textContainer.innerText = "Errore durante il riconoscimento del testo.";
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
});

