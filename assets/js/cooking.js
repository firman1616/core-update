let cookingCount = 1;

function addCooking() {
    cookingCount++;
    const cookingContainer = document.getElementById("cookingContainer");
    const firstCooking = cookingContainer.querySelector(".cooking-group");
    const newCooking = firstCooking.cloneNode(true);

    newCooking.querySelector("h1").textContent = `Cooking ${cookingCount}`;
    const selects = newCooking.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newCooking.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    cookingContainer.appendChild(newCooking);
    updateCookingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeCooking(button) {
    const cookingContainer = document.getElementById("cookingContainer");
    const cook = cookingContainer.querySelectorAll(".cooking-group");

    if (cook.length > 1) {
        const cooking = button.closest(".cooking-group");
        cooking.remove();
        updateCookingTitles();
        cookingCount--;
    } else {
        alert("Minimal satu cooking harus ada.");
    }
}

function updateCookingTitles() {
    const cook = document.querySelectorAll("#cookingContainer .cooking-group");
    cook.forEach((cooking, index) => {
        cooking.querySelector("h1").textContent = `Cooking & Cooling ${index + 1}`;
    });
}

function checkOption(select) {
    const cookingGroup = select.closest(".cooking-group");

    const inputDiv = cookingGroup.querySelector(".inputLainnya");
    const countInput = cookingGroup.querySelector(".count-wrapper");

    // Tampilkan input "Others" jika dipilih
    if (select.value === 'Others') {
        inputDiv.style.display = 'block';
    } else {
        inputDiv.style.display = 'none';
    }

    // Sembunyikan Count jika pilih Not Found
    if (select.value === 'NotFound') {
        countInput.style.display = 'none';
        countInput.querySelector("input").value = ""; // reset value
    } else {
        countInput.style.display = 'block';
    }
}
