$(document).ready(function () {
	tableBarang();
	$("#id").val("");
});

function tableBarang() {
	$("#tableBarang").DataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		ajax: {
			url: BASE_URL + "Barang/getBarang",
			type: "POST",
		},
		autoWidth: false,
		scrollX: true,
		fixedColumns: {
			left: 2, // contoh, biar kolom No & Kode Barang tetap ngikut
		},
		dom:
			"<'row'<'col-md-6 d-flex justify-content-start'f><'col-md-6 d-flex justify-content-end align-items-start'<'btn-group-custom'>>>" +
			"<'row'<'col-sm-12'tr>>" +
			"<'row'<'col-md-4'l><'col-md-4 text-center'i><'col-md-4'p>>",
	});

	let buttonHTML = "";

	if (akses_create_item) {
		buttonHTML += `
            <button class="btn btn-primary" id="TambahData">
                <span class="btn-label"><i class="fa fa-plus"></i></span> Tambah data
            </button>
            <button class="btn btn-success" id="ImportData">
                <span class="btn-label"><i class="fa fa-file-import"></i></span> Import data
            </button>
        `;
	}

	$(".btn-group-custom").html(buttonHTML);
}
