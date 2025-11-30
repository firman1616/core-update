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

let boxCount = 1;

function addBox() {
    boxCount++;
    const boxContainer = document.getElementById("boxContainer");
    const firstBox = boxContainer.querySelector(".box-group");
    const newBox = firstBox.cloneNode(true);

    newBox.querySelectorAll("input").forEach(input => input.value = "");
    newBox.querySelector("h1").textContent = `Box ${boxCount}`;
    boxContainer.appendChild(newBox);
    updateBoxTitles(); // Untuk pastikan nomor urut selalu benar
}

function removeBox(button) {
    const boxContainer = document.getElementById("boxContainer");
    const boxes = boxContainer.querySelectorAll(".box-group");

    if (boxes.length > 1) {
        const box = button.closest(".box-group");
        box.remove();
        updateBoxTitles();
        boxCount--;
    } else {
        alert("Minimal satu box harus ada.");
    }
}

function updateBoxTitles() {
    const boxes = document.querySelectorAll("#boxContainer .box-group");
    boxes.forEach((box, index) => {
        box.querySelector("h1").textContent = `Box ${index + 1}`;
    });
}


let panelisCount = 1;

function addPanelis() {
	panelisCount++;
	const panelisContainer = document.getElementById("panelisContainer");
	const firstPanelis = panelisContainer.querySelector(".panelis-group");
	const newPanelis = firstPanelis.cloneNode(true);

	newPanelis.querySelector("h1").textContent = `Panelis ${panelisCount}`;
	const selects = newPanelis.querySelectorAll("select");
	selects.forEach(select => select.selectedIndex = 0); // reset select
	const inputs = newPanelis.querySelectorAll("input");
	inputs.forEach(input => input.value = ""); // clear input

	panelisContainer.appendChild(newPanelis);
    updatePanelisTitles(); // Untuk pastikan nomor urut selalu benar
}

function removePanelis(button) {
    const panelisContainer = document.getElementById("panelisContainer");
    const panel = panelisContainer.querySelectorAll(".panelis-group");

    if (panel.length > 1) {
        const panelis = button.closest(".panelis-group");
        panelis.remove();
        updatePanelisTitles();
        panelisCount--;
    } else {
        alert("Minimal satu panelis harus ada.");
    }
}

function updatePanelisTitles() {
    const panel = document.querySelectorAll("#panelisContainer .panelis-group");
    panel.forEach((panelis, index) => {
        panelis.querySelector("h1").textContent = `Panelis ${index + 1}`;
    });
}

function checkOption(select) {
	var inputDiv = document.getElementById('inputLainnya');
	if (select.value === 'lain') {
		inputDiv.style.display = 'block';
	} else {
		inputDiv.style.display = 'none';
	}
}

document.getElementById("multiStepForm").addEventListener("submit", function(e) {
	e.preventDefault();
	alert("Form submitted!");
});
