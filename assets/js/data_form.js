$(document).ready(function () {
	tableDataForm();
	$("#id").val("");
	$("#dataformForm").trigger("reset");

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#dataformForm").serialize(),
			url: BASE_URL + "Bagian/store",
			type: "POST",
			dataType: "json",
			success: function (res) {
				if (res.status === "success") {
					$("#dataformForm").trigger("reset");
					Swal.fire({
						icon: "success",
						title: "Berhasil!",
						text: res.message,
						timer: 1500,
						showConfirmButton: false,
					});
					tableDataForm();
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
		$("#dataformForm")[0].reset();

		// Sembunyikan tombol cancel
		$(this).hide();
	});
});

// function tableDataForm() {
// 	$.ajax({
// 		url: BASE_URL + "DF/tableDataForm",
// 		type: "POST",
// 		success: function (data) {
// 			$("#div-table-data-form").html(data);
// 			$("#tableDataForm").DataTable({
// 				processing: true,
// 				responsive: true,
// 			});
// 		},
// 	});
// }

function tableDataForm() {
	$.ajax({
		url: BASE_URL + "DF/tableDataForm",
		type: "POST",
		dataType: "json",
		success: function (res) {
			$("#div-table-data-form").html(res.html);

			let table = $("#tableDataForm").DataTable({
				processing: true,
				responsive: true,
				destroy: true,
				dom:
					"<'row'<'col-md-6'f><'col-md-6 d-flex justify-content-end align-items-start'<'btn-group-custom'>>>" +
					"<'row'<'col-sm-12'tr>>" +
					"<'row'<'col-md-4'l><'col-md-4 text-center'i><'col-md-4'p>>",
			});

			// Tambahkan button custom
			if (res.canAdd) {
				$(".btn-group-custom").html(`
					<a href="#" 
					class="btn btn-primary" 
					id="btnTambahData">
					<i class="fa fa-plus"></i> Tambah Data
					</a>
					<button type="button" class="btn btn-secondary" id="btnRefreshTable">
						<i class="fa fa-sync"></i> Refresh
					</button>
				`);
			}

			// Custom reposition
			setTimeout(function () {
				$(".dataTables_filter").css({
					float: "left",
					"text-align": "left",
				});
				$(".dataTables_length").css({
					float: "left",
					"text-align": "left",
				});
				$(".dataTables_info").css({
					"text-align": "center",
					float: "none",
					margin: "0 auto",
					display: "block",
				});
			}, 10);
		},
	});
}
