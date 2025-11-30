let peelingCount = 1;

function addPeeling() {
    peelingCount++;
    const peelingContainer = document.getElementById("peelingContainer");
    const firstPeeling = peelingContainer.querySelector(".peeling-group");
    const newPeeling = firstPeeling.cloneNode(true);

    newPeeling.querySelector("h1").textContent = `Peeling ${peelingCount}`;
    const selects = newPeeling.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newPeeling.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    peelingContainer.appendChild(newPeeling);
    updatePeelingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removePeeling(button) {
    const peelingContainer = document.getElementById("peelingContainer");
    const peel = peelingContainer.querySelectorAll(".peeling-group");

    if (peel.length > 1) {
        const peeling = button.closest(".peeling-group");
        peeling.remove();
        updatePeelingTitles();
        peelingCount--;
    } else {
        alert("Minimal satu peeling harus ada.");
    }
}

function updatePeelingTitles() {
    const peel = document.querySelectorAll("#peelingContainer .peeling-group");
    peel.forEach((peeling, index) => {
        peeling.querySelector("h1").textContent = `Peeling ${index + 1}`;
    });
}

function checkOption(select) {
    const peelingGroup = select.closest(".peeling-group");

    const inputDiv = peelingGroup.querySelector(".inputLainnya");
    const otherInput = inputDiv.querySelector("input");
    const countWrapper = peelingGroup.querySelector(".count-wrapper");
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