$(document).ready(function () {
	tableBagian();
	$("#id").val("");
	$("#bagianForm").trigger("reset");

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#bagianForm").serialize(),
			url: BASE_URL + "Bagian/store",
			type: "POST",
			dataType: "json",
			success: function (res) {
				if (res.status === "success") {
					$("#bagianForm").trigger("reset");
					Swal.fire({
						icon: "success",
						title: "Berhasil!",
						text: res.message,
						timer: 1500,
						showConfirmButton: false,
					});
					tableBagian();
				} else if (res.status === "error") {
					Swal.fire({
						icon: "warning",
						title: "Peringatan!",
						text: res.message,
						showConfirmButton: true,
					});
				}
			},
			error: function (xhr, status, error) {
				console.log("Error:", error);
				Swal.fire({
					icon: "error",
					title: "Oops...",
					text: "Terjadi kesalahan pada server!",
				});
			},
		});
	});

	$("body").on("click", ".edit", function (e) {
		var id = $(this).data("id");
		$.ajax({
			url: BASE_URL + "Bagian/vedit/" + id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// console.log(data);
				$("#id").val(id);
				$("#kode_bagian").val(data.kode_bagian);
				$("#nama_bagian").val(data.nama_bagian);
			},
		});
		$("#cancel-edit").show();
	});

	$("#cancel-edit").on("click", function () {
		// Reset form
		$("#bagianForm")[0].reset();

		// Sembunyikan tombol cancel
		$(this).hide();
	});
});

function tableBagian() {
	$.ajax({
		url: BASE_URL + "Bagian/tableBagian",
		type: "POST",
		success: function (data) {
			$("#div-table-bagian").html(data);
			$("#tableBagian").DataTable({
				processing: true,
				responsive: true,
			});
		},
	});
}
