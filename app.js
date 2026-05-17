const captureBtn = document.getElementById("captureBtn");
const cameraInput = document.getElementById("cameraInput");
const textContainer = document.getElementById("textContainer");

captureBtn.addEventListener("click", () => {
  cameraInput.click();
});

cameraInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.src = e.target.result;
    textContainer.innerHTML = "";
    textContainer.appendChild(img);
  };
  reader.readAsDataURL(file);
});


