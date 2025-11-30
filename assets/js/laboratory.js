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

const input = document.querySelector('#standardInput');
const indicator = document.querySelector('#standardIndicator');

input.addEventListener('input', () => {
const value = parseFloat(input.value);

if (isNaN(value)) {
    indicator.textContent = '';
}else if (value >= 0 && value <= 10) {
    indicator.textContent = 'Negative';
} else if (value > 10) {
    indicator.textContent = 'Positive';
} else {
    indicator.textContent = '';
}
});


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
