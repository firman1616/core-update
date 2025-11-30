let freezingCount = 1;

function addFreezing() {
    freezingCount++;
    const freezingContainer = document.getElementById("freezingContainer");
    const firstFreezing = freezingContainer.querySelector(".freezing-group");
    const newFreezing = firstFreezing.cloneNode(true);

    newFreezing.querySelector("h1").textContent = `Freezing ${freezingCount}`;
    const selects = newFreezing.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newFreezing.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    freezingContainer.appendChild(newFreezing);
    updateFreezingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeFreezing(button) {
    const freezingContainer = document.getElementById("freezingContainer");
    const freez = freezingContainer.querySelectorAll(".freezing-group");

    if (freez.length > 1) {
        const freezing = button.closest(".freezing-group");
        freezing.remove();
        updateFreezingTitles();
        freezingCount--;
    } else {
        alert("Minimal satu freezing harus ada.");
    }
}

function updateFreezingTitles() {
    const freez = document.querySelectorAll("#freezingContainer .freezing-group");
    freez.forEach((freezing, index) => {
        freezing.querySelector("h1").textContent = `Freezing ${index + 1}`;
    });
}

function checkOption(select) {
    const freezingGroup = select.closest(".freezing-group");

    const inputDiv = freezingGroup.querySelector(".inputLainnya");
    const otherInput = inputDiv.querySelector("input");
    const countWrapper = freezingGroup.querySelector(".count-wrapper");
    const countInput = countWrapper.querySelector("input");

    // Jika pilih Others, tampilkan dan aktifkan input
    if (select.value === 'Others') {
        inputDiv.style.display = 'block';
        otherInput.disabled = false;
        otherInput.value = ""; // reset nilai jika sebelumnya terisi
    } else {
        otherInput.disabled = true;
        otherInput.value = "";
    }

    if (select.value === 'NotFound') {
        countInput.disabled = true;
        countInput.classList.add('disabled-field');
        countInput.value = "";
    } else {
        countInput.disabled = false;
        countInput.classList.remove('disabled-field');
    }
}

function checkDefect(selectElement) {
    const defectStandard = document.getElementById("DefectStandard");

    if (selectElement.value === "None") {
        defectStandard.value = "";
        defectStandard.disabled = true;
    } else {
        defectStandard.disabled = false;
    }
}