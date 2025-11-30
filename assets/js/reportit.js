$(document).ready(function () {
	$("#id").val("");

	$(document).on("submit", "#formAddReport", function (e) {
		e.preventDefault();

		$.ajax({
			url: BASE_URL + "ReportIT/store",
			type: "POST",
			data: $(this).serialize(),
			dataType: "json",
			success: function (response) {
				if (response.status === "success") {
					Swal.fire({
						icon: "success",
						title: "Berhasil",
						text: response.message,
						showConfirmButton: false,
						timer: 1500,
					}).then(() => {
						location.reload(); // reload halaman setelah swal hilang
					});
				} else {
					Swal.fire({
						icon: "error",
						title: "Gagal",
						text: response.message,
						showConfirmButton: false,
						timer: 2000,
					});
				}
			},
		});
	});

	$(document).on("click", ".add-data", function () {
		let modal = new bootstrap.Modal(document.getElementById("addReportModal"));
		modal.show();
	});
});
