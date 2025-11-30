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

let soakingCount = 1;

function addSoaking() {
    soakingCount++;
    const soakingContainer = document.getElementById("soakingContainer");
    const firstSoaking = soakingContainer.querySelector(".soaking-group");
    const newSoaking = firstSoaking.cloneNode(true);

    newSoaking.querySelector("h1").textContent = `Soaking ${soakingCount}`;
    const selects = newSoaking.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newSoaking.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    soakingContainer.appendChild(newSoaking);
    updateSoakingTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeSoaking(button) {
    const soakingContainer = document.getElementById("soakingContainer");
    const soak = soakingContainer.querySelectorAll(".soaking-group");

    if (soak.length > 1) {
        const soaking = button.closest(".soaking-group");
        soaking.remove();
        updateSoakingTitles();
        soakingCount--;
    } else {
        alert("Minimal satu soaking harus ada.");
    }
}

function updateSoakingTitles() {
    const soak = document.querySelectorAll("#soakingContainer .soaking-group");
    soak.forEach((soaking, index) => {
        soaking.querySelector("h1").textContent = `Box ${index + 1}`;
    });
}

let chemicalCount = 1;

function addChemical() {
    chemicalCount++;
    const chemicalContainer = document.getElementById("chemicalContainer");
    const firstChemical = chemicalContainer.querySelector(".chemical-group");
    const newChemical = firstChemical.cloneNode(true);

    newChemical.querySelector("h1").textContent = `Chemical ${chemicalCount}`;
    const selects = newChemical.querySelectorAll("select");
    selects.forEach(select => select.selectedIndex = 0); // reset select
    const inputs = newChemical.querySelectorAll("input");
    inputs.forEach(input => input.value = ""); // clear input

    chemicalContainer.appendChild(newChemical);
    updateChemicalTitles(); // Untuk pastikan nomor urut selalu benar
}

document.getElementById("multiStepForm").addEventListener("submit", function(e) {
	e.preventDefault();
	alert("Form submitted!");
});
