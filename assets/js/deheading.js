function goToTab(tabNumber) {
    var currentTab = $('.tab-pane.active');
    var inputs = currentTab.find('input[required]');
    var valid = true;

    // cek semua input required di tab aktif
    inputs.each(function() {
        if (!$(this).val()) {
            $(this).addClass('is-invalid');
            valid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });

    // validasi date (hanya hari ini / kemarin / sebelumnya)
    if (currentTab.attr('id') === 'tab1') {
        var dateVal = $('#date').val();
        if (dateVal) {
            // ubah ke format string yyyy-mm-dd
            var inputDate = new Date(dateVal + "T00:00:00");
            
            // ambil tanggal hari ini & kemarin (tanpa jam)
            var today = new Date();
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            var yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            if (inputDate > today) {
                $('#date').addClass('is-invalid');
                $('#date').siblings('.invalid-feedback').text('The selected date cannot be later than today');
                valid = false;
            } else {
                $('#date').removeClass('is-invalid');
                $('#date').siblings('.invalid-feedback').text('Required');
            }
        }
    }

    // stop kalau masih ada error
    if (!valid && tabNumber > getCurrentTabIndex()) {
        return;
    }

    // pindah tab (Bootstrap 4 jQuery)
    $('#tab' + tabNumber + '-tab').tab('show');
}

let weighingCount = 1;
let washingCount = 1;

function addWeighing() {
    weighingCount++;
    const weighingContainer = document.getElementById("weighingContainer");
    const firstWeighing = weighingContainer.querySelector(".weighing-group");
    const newWeighing = firstWeighing.cloneNode(true);

    newWeighing.querySelector("h1").textContent = `Weighing ${weighingCount}`;
    const selects = newWeighing.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newWeighing.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    weighingContainer.appendChild(newWeighing);
    updateWeighingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeWeighing(button) {
    const weighingContainer = document.getElementById("weighingContainer");
    const weigh = weighingContainer.querySelectorAll(".weighing-group");

    if (weigh.length > 1) {
        const weighing = button.closest(".weighing-group");
        weighing.remove();
        updateWeighingTitles();
        weighingCount--;
    } else {
        alert("Minimal satu weighing harus ada.");
    }
}

function updateWeighingTitles() {
    const weigh = document.querySelectorAll("#weighingContainer .weighing-group");
    weigh.forEach((weighing, index) => {
        weighing.querySelector("h1").textContent = `Weighing ${index + 1}`;
    });
}

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
        washing.querySelector("h1").textContent = `Panelis ${index + 1}`;
    });
}

document.getElementById("multiStepForm").addEventListener("submit", function(e) {
	e.preventDefault();
	alert("Form submitted!");
});
