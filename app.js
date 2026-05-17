const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

captureBtn.addEventListener("click", () => {
  console.log("Click su Scatta una foto");
  cameraInput.click();
});

cameraInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    textContainer.textContent = "Nessun file selezionato.";
    return;
  }
  textContainer.textContent = "Foto selezionata: " + file.name;
});






