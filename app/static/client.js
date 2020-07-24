const audioClip = new Audio("../static/whos-that-pokemon.mp3");
const fileInput = document.querySelector("#file-input");

const pickedImagePanel = document.querySelector(".picked-image-panel");
const pickedImage = document.querySelector("#picked-image");

const imagePickerPanel = document.querySelector(".image-picker-panel");
const analyzeDiv = document.querySelector(".analyze");

const results = document.querySelector(".results");
const resultsAnalyzing = document.querySelector(".results__analyzing");
const resultsError = document.querySelector(".results__error");
const resultsFound = document.querySelector(".results__found");
const resultText = document.querySelector(".result-text");

function showImagePicker() {
  fileInput.click();
}

function pickImage(input) {
  const reader = new FileReader();
  reader.onload = (e) => {
    pickedImage.src = e.target.result;
    pickedImagePanel.classList.remove("no-display");
    imagePickerPanel.classList.add("no-display");
    analyzeDiv.classList.add("analyze--visible");
  };
  reader.readAsDataURL(input.files[0]);
}

function clearImage() {
  fileInput.value = "";
  pickedImage.src = "";
  pickedImagePanel.classList.add("no-display");
  imagePickerPanel.classList.remove("no-display");
  analyzeDiv.classList.remove("analyze--visible");
}

function analyze() {
  const uploadFiles = fileInput.files;
  if (uploadFiles.length !== 1) {
    // Error out if no file picked
    console.log("Select a file to analyze");
    return;
  }

  // Play the audio and show the results screen
  audioClip.currentTime = 0;
  audioClip.play();
  results.classList.add("results--visible");
  resultsAnalyzing.classList.remove("no-display");
  resultsError.classList.add("no-display");
  resultsFound.classList.add("no-display");

  const xhr = new XMLHttpRequest();
  const loc = window.location;

  xhr.open(
    "POST",
    `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true
  );

  xhr.onerror = function () {
    console.log(xhr.responseText);
    resultsAnalyzing.classList.add("no-display");
    resultsError.classList.remove("no-display");
    resultsFound.classList.add("no-display");
  };

  xhr.onload = function (e) {
    if (this.readyState === 4) {
      const response = JSON.parse(e.target.responseText);
      console.log("Analysis complete...");

      setTimeout(() => {
        resultsAnalyzing.classList.add("no-display");
        resultsError.classList.add("no-display");
        resultsFound.classList.remove("no-display");
        resultText.innerHTML = response["result"].toUpperCase();
        resultText.className = response["result"];
      }, 2000);
    }
  };

  const fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

function closeResults() {
  results.classList.remove("results--visible");
}
