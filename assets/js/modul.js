$(document).ready(function () {
	tableModul();
	$("#id").val("");
	$("#modulForm").trigger("reset");

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#modulForm").serialize(),
			url: BASE_URL + "Modul/store",
			type: "POST",
			datatype: "json",
			success: function (data) {
				$("#modulForm").trigger("reset");
				Swal.fire({
					title: "Good job!",
					text: "Data Berhasil disimpan!",
					icon: "success",
					timer: 1500,
					showConfirmButton: false,
				});
				tableModul();
			},
			error: function (data) {
				console.log("Error:", data);
				$("$save-data").html("Simpan Data");
			},
		});
	});

	$("body").on("click", ".edit", function (e) {
		var id = $(this).data("id");
		$.ajax({
			url: BASE_URL + "Modul/vedit/" + id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// console.log(data);
				$("#id").val(id);
				$("#nama_modul").val(data.name);
				$("#icon_modul").val(data.icon);
				$("#url_modul").val(data.url_modul);
			},
		});
		$("#cancel-edit").show();
	});

	$("#cancel-edit").on("click", function () {
		// Reset form
		$("#modulForm")[0].reset();

		// Sembunyikan tombol cancel
		$(this).hide();
	});
});

function tableModul() {
	$.ajax({
		url: BASE_URL + "Modul/tableModul",
		type: "POST",
		success: function (data) {
			$("#div-table-modul").html(data);
			$("#tableModul").DataTable({
				processing: true,
				responsive: true,
			});
		},
	});
}
