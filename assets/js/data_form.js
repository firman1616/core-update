$(document).ready(function () {
	tableDataForm();
	$("#id").val("");
	$("#dataformForm").trigger("reset");

	$("#customer").select2({
		placeholder: "Pilih Customer",
		allowClear: true,
		ajax: {
			url: BASE_URL + "DF/get_customer_odoo",
			dataType: "json",
			delay: 250,
			data: function (params) {
				return {
					term: params.term // ⬅️ WAJIB term
				};
			},
			processResults: function (data) {
				return {
					results: data // ⬅️ data sudah array select2
				};
			},
			cache: true
		}
	});

	$("#product_type").select2({
		placeholder: "Pilih Product Type",
		allowClear: true,
		width: "100%",
		ajax: {
			url: BASE_URL + "DF/get_product_type_precost",
			dataType: "json",
			delay: 250,
			data: function (params) {
				return {
					term: params.term
				};
			},
			processResults: function (data) {
				return {
					results: data
				};
			},
			cache: true
		}
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
                        <a href="` + BASE_URL + `DF/vtambah" class="btn btn-primary">
							<i class="fa fa-plus"></i> Tambah Data
						</a>
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