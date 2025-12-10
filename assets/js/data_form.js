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
        success: function (data) {
            $("#div-table-data-form").html(data);

            let dt = $("#tableDataForm").DataTable({
                processing: true,
                responsive: true,
                dom:
                    "<'row'<'col-sm-6'f><'col-sm-6 text-right'<'toolbar'>>>" + // Search kiri, toolbar kanan
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-sm-4'l><'col-sm-4'i><'col-sm-4'p>>",

                initComplete: function () {
                    // Tambahkan tombol ke dalam div .toolbar
                    $("div.toolbar").html(`
                        <button class="btn btn-primary" id="btnTambahData">
                            <i class="fa fa-plus"></i> Tambah Data
                        </button>
                    `);

                    // Event tombol
                    $("#btnTambahData").on("click", function () {
                        tambahDataForm(); // panggil fungsi kamu
                    });
                },
            });
        },
    });
}