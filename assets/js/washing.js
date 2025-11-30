let washingCount = 1;

function addWashing() {
    washingCount++;
    const washingContainer = document.getElementById("washingContainer");
    const firstWashing = washingContainer.querySelector(".washing-group");
    const newWashing = firstWashing.cloneNode(true);

    newWashing.querySelector("h1").textContent = `Washing ${washingCount}`;
    const selects = newWashing.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newWashing.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    washingContainer.appendChild(newWashing);
    updateWashingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeWashing(button) {
    const washingContainer = document.getElementById("washingContainer");
    const wash = washingContainer.querySelectorAll(".washing-group");

    if (wash.length > 1) {
        const washing = button.closest(".washing-group");
        washing.remove();
        updateWashingTitles();
        washingCount--;
    } else {
        alert("Minimal satu washing harus ada.");
    }
}

function updateWashingTitles() {
    const wash = document.querySelectorAll("#washingContainer .washing-group");
    wash.forEach((washing, index) => {
        washing.querySelector("h1").textContent = `Washing ${index + 1}`;
    });
}