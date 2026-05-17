console.log("Supergufetto: JS caricato!");

const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

captureBtn.addEventListener("click", () => {
  textContainer.textContent = "Click ricevuto!";
  cameraInput.click();
});

cameraInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    textContainer.textContent = "Nessuna foto.";
    return;
  }
  textContainer.textContent = "Foto selezionata: " + file.name;
});






