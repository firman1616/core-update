let sortingCount = 0;
function addSorting() {
    sortingCount++;
    const sortingContainer = document.getElementById("sortingContainer");
    const firstSorting = sortingContainer.querySelector(".sorting-group");
    const newSorting = firstSorting.cloneNode(true);

    newSorting.querySelector("h1").textContent = `Sorting ${sortingCount}`;
    const selects = newSorting.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newSorting.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    sortingContainer.appendChild(newSorting);
    updateSortingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeSorting(button) {
    const sortingContainer = document.getElementById("sortingContainer");
    const sort = sortingContainer.querySelectorAll(".sorting-group");

    if (sort.length > 1) {
        const sorting = button.closest(".sorting-group");
        sorting.remove();
        updateSortingTitles();
        sortingCount--;
    } else {
        alert("Minimal satu sorting harus ada.");
    }
}

function updateSortingTitles() {
    const sort = document.querySelectorAll("#sortingContainer .sorting-group");
    sort.forEach((sorting, index) => {
        sorting.querySelector("h1").textContent = `Sorting ${index + 1}`;
    });
}

function addCount() {
    const container = event.target.closest(".sorting-group").querySelector("#uniformityContainer");
    const firstGroup = container.querySelector(".uniformity-group");
    const newGroup = firstGroup.cloneNode(true);

    // Kosongkan input
    const inputs = newGroup.querySelectorAll("input");
    inputs.forEach(input => input.value = "");

    container.appendChild(newGroup);
}

function removeCount(button) {
    const container = button.closest("#uniformityContainer");
    const groups = container.querySelectorAll(".uniformity-group");

    if (groups.length > 1) {
        button.closest(".uniformity-group").remove();
    } else {
        alert("Minimal satu Count harus ada.");
    }
}