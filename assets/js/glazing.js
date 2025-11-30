let glazingCount = 1;

function addGlazing() {
    glazingCount++;
    const glazingContainer = document.getElementById("glazingContainer");
    const firstGlazing = glazingContainer.querySelector(".glazing-group");
    const newGlazing = firstGlazing.cloneNode(true);

    newGlazing.querySelector("h1").textContent = `Glazing ${glazingCount}`;
    const selects = newGlazing.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newGlazing.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    glazingContainer.appendChild(newGlazing);
    updateGlazingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeGlazing(button) {
    const glazingContainer = document.getElementById("glazingContainer");
    const glaz = glazingContainer.querySelectorAll(".glazing-group");

    if (glaz.length > 1) {
        const glazing = button.closest(".glazing-group");
        glazing.remove();
        updateGlazingTitles();
        glazingCount--;
    } else {
        alert("Minimal satu glazing harus ada.");
    }
}

function updateGlazingTitles() {
    const glaz = document.querySelectorAll("#glazingContainer .glazing-group");
    glaz.forEach((glazing, index) => {
        glazing.querySelector("h1").textContent = `Glazing ${index + 1}`;
    });
}

function checkOption(select) {
    const glazingGroup = select.closest(".glazing-group");

    const inputDiv = glazingGroup.querySelector(".inputLainnya");
    const otherInput = inputDiv.querySelector("input");
    const countWrapper = glazingGroup.querySelector(".count-wrapper");
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