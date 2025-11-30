$(document).ready(function () {
	$("#id").val("");

	// get data
	$(document).on("click", ".btn-update-realisasi", function () {
		let id = $(this).data("id");
		$("#idRealisasi").val(id);

		$.ajax({
			url: BASE_URL + "Stuffing/get_detail_header_realisasi/" + id,
			type: "GET",
			dataType: "json",
			success: function (res) {
				if (res) {
					$("#tot_qty_plan").val(res.tot_qty_plan);
					$("#tot_qty_real").val(res.tot_qty_real);
					$("#tot_vol_plan").val(res.volume);
					$("#max_volume").val(res.volume_container);
					$("#max_payload").val(res.maxPayload);
					$("#tot_vol_real").val(res.volume_real);
					$("#prosen_vol_plan").val(
						parseFloat(res.prosen_volume).toFixed(2) + " %"
					);
					$("#prosen_vol_real").val(
						parseFloat(res.prosen_volume_real).toFixed(2) + " %"
					);
					$("#prosen_berat_plan").val(
						parseFloat(res.prosen_berat).toFixed(2) + " %"
					);
					$("#prosen_berat_real").val(
						parseFloat(res.prosen_berat_real).toFixed(2) + " %"
					);
					$("#tot_berat_plan").val(res.berat);
					$("#tot_berat_real").val(res.berat_real);

					loadDetailBarang(id);
					hitungTotalQtyRealisasi();
					hitungTotalVolRealisasi();
					hitungTotalBeratRealisasi();
				}
				$("#modalRealisasi").modal("show");
			},
			error: function () {
				Swal.fire("Error", "Gagal ambil data stuffing!", "error");
			},
		});
	});

	let rowIndex = 0;

	// <td class="text-center">
    //             <button type="button" class="btn btn-danger btn-sm btn-hapus-row">
    //                 <i class="fa fa-trash"></i>
    //             </button>
    //         </td>

	$(document).on("click", ".add-real", function () {
		rowIndex++;
		let newRow = `
        <tr>
            <td class="text-center">${rowIndex}</td>
            <td>
				<select name="data[${rowIndex}][no_so]" class="form-control form-control-sm select-no-so" style="width: 100%"></select>
			</td>
            <td><input type="text" name="data[${rowIndex}][no_counter]" class="form-control form-control-sm" placeholder="No Counter"></td>
            <td>
				<select name="data[${rowIndex}][nama_barang]" class="form-control form-control-sm select-nama-barang" style="width: 100%"></select>
				<input type="hidden" name="data[${rowIndex}][kode_barang]" class="kode-barang">
				<input type="hidden" name="data[${rowIndex}][volume]" class="volume-barang">
				<input type="hidden" name="data[${rowIndex}][berat_net]" class="berat-barang">
			</td>
            <td><input type="number" name="data[${rowIndex}][qty_plan]" class="form-control form-control-sm" step="0.01" value="0" readonly></td>
            <td><input type="number" name="data[${rowIndex}][qty_realisasi]" class="form-control form-control-sm" step="0.01" value="0"></td>
            
        </tr>
        `;
		$("#tableDetailBarang tbody").append(newRow);

		// get data MO
		$(".select-no-so")
			.last()
			.select2({
				placeholder: "Pilih No SO",
				allowClear: true,
				minimumInputLength: 1,
				dropdownParent: $("#modalRealisasi"), // ⬅️ penting biar bisa diketik dalam modal
				ajax: {
					url: BASE_URL + "Stuffing/get_mo_data",
					dataType: "json",
					delay: 250,
					data: function (params) {
						return { q: params.term };
					},
					processResults: function (data) {
						return { results: data };
					},
					cache: true,
				},
			})
			.on("select2:select", function (e) {
				var data = e.params.data;
				var row = $(this).closest("tr");
				row.find("input[name^='data'][name$='[no_counter]']").val(data.counter);
			});

		// get data barang
		$(".select-nama-barang")
			.last()
			.select2({
				placeholder: "Pilih Barang",
				allowClear: true,
				minimumInputLength: 1,
				dropdownParent: $("#modalRealisasi"),
				ajax: {
					url: BASE_URL + "Stuffing/get_barang_data",
					dataType: "json",
					delay: 250,
					data: function (params) {
						return { q: params.term };
					},
					processResults: function (data) {
						return { results: data };
					},
					cache: true,
				},
				templateResult: function (data) {
					if (!data.id) return data.text;
					let text =
						data.text.length > 50
							? data.text.substring(0, 50) + "..."
							: data.text;
					return text;
				},
				templateSelection: function (data) {
					if (!data.id) return data.text;
					let text =
						data.text.length > 60
							? data.text.substring(0, 60) + "..."
							: data.text;
					return text;
				},
			})
			.on("select2:select", function (e) {
				var data = e.params.data;
				var row = $(this).closest("tr");

				// isi hidden input
				row.find(".kode-barang").val(data.prod_kode);
				row.find(".volume-barang").val(data.volume);
				row.find(".berat-barang").val(data.berat_net);

				// kalau mau tampilkan di kolom Qty Plan otomatis (misalnya 1 × volume)
				// row.find("input[name^='data'][name$='[qty_plan]']").val(data.volume);
			});

		hitungTotalQtyRealisasi();
		hitungTotalVolRealisasi();
		hitungTotalBeratRealisasi();
		updateRowNumbers();
	});

	// ketika user mengubah qty_realisasi
	$(document).on(
		"input",
		"input[name^='data'][name$='[qty_realisasi]']",
		function () {
			hitungTotalQtyRealisasi();
			hitungTotalVolRealisasi();
			hitungTotalBeratRealisasi();
		}
	);

	// hapus row
	$(document).on("click", ".btn-hapus-row", function () {
		$(this).closest("tr").remove();
		hitungTotalQtyRealisasi();
		hitungTotalVolRealisasi();
		hitungTotalBeratRealisasi();
		updateRowNumbers();
	});

	// update realisasi
	$(document).on("click", ".update-realisasi", function () {
		let form = $("#formRealisasi");

		$.ajax({
			url: BASE_URL + "Stuffing/update_realisasi",
			type: "POST",
			data: form.serialize(),
			dataType: "json",
			success: function (res) {
				if (res.status === "success") {
					Swal.fire("Berhasil", res.message, "success");
					$("#modalRealisasi").modal("hide");
					// reload datatable / page
					if (typeof tableStuffing === "function") {
						tableStuffing();
					}
				} else {
					Swal.fire("Gagal", res.message, "error");
				}
			},
			error: function () {
				Swal.fire("Error", "Terjadi kesalahan server!", "error");
			},
		});
	});
});

function loadDetailBarang(stuff_id) {
	$.ajax({
		url: BASE_URL + "Stuffing/get_detail_barang_realisasi/" + stuff_id,
		type: "GET",
		dataType: "json",
		success: function (res) {
			let tbody = $("#tableDetailBarang tbody");
			tbody.empty();

			if (res && res.length > 0) {
				res.forEach((item, index) => {
					tbody.append(`
							<tr>
								<td>${index + 1}</td>
								<td><input type="text" class="form-control form-control-sm" name="no_so[${index}]" value="${
						item.mo_id
					}" readonly></td>
								<td><input type="text" class="form-control form-control-sm" name="no_counter[${index}]" value="${
						item.counter
					}" readonly></td>
								<td>
									<input type="text" class="form-control form-control-sm" name="nama_barang[${index}]" value="${
							item.prod_kode + ' - ' + item.prod_name
						}" readonly>

									<!-- hidden fields -->
									<input type="hidden" name="data[${index}][id]" value="${
						item.id
					}">   <!-- tambahin ini -->
									<input type="hidden" name="data[${index}][kode_barang]" class="kode-barang" value="${
						item.prod_kode
					}">
									<input type="hidden" name="data[${index}][volume]" class="volume-barang" value="${
						item.volume
					}">
									<input type="hidden" name="data[${index}][berat_net]" class="berat-barang" value="${
						item.berat_net
					}">
								</td>
								<td><input type="number" class="form-control form-control-sm" name="qty_plan[${index}]" value="${
						item.qty
					}" readonly></td>
								<td><input type="number" class="form-control form-control-sm" name="data[${index}][qty_realisasi]" value="${
						item.qty_realisasi ?? 0
					}"></td>
								<td class="text-center"></td>
							</tr>
					`);
				});
			} else {
				tbody.append(
					`<tr><td colspan="7" class="text-center">Data tidak ada</td></tr>`
				);
			}
			hitungTotalQtyRealisasi();
			hitungTotalVolRealisasi();
			hitungTotalBeratRealisasi();
		},
		error: function () {
			Swal.fire("Error", "Gagal ambil detail barang!", "error");
		},
	});
}

function updateRowNumbers() {
	$("#tableDetailBarang tbody tr").each(function (i) {
		$(this)
			.find("td:first")
			.text(i + 1);
	});
}

// hitung total qty realisasi
function hitungTotalQtyRealisasi() {
	let total = 0;
	$("#tableDetailBarang tbody input[name$='[qty_realisasi]']").each(
		function () {
			let val = parseFloat($(this).val()) || 0;
			total += val;
		}
	);
	$("#tot_qty_real").val(total.toFixed(2));
}

function hitungTotalVolRealisasi() {
	let total = 0;

	// Hitung total volume realisasi dari tabel
	$("#tableDetailBarang tbody tr").each(function () {
		let qty =
			parseFloat(
				$(this).find("input[name^='data'][name$='[qty_realisasi]']").val()
			) || 0;
		let volume = parseFloat($(this).find(".volume-barang").val()) || 0;

		total += qty * volume;
	});

	// Set total volume realisasi
	$("#tot_vol_real").val(total.toFixed(2));
	

	// Ambil nilai max_volume
	let maxVolume = parseFloat($("#max_volume").val()) || 0;

	// Hitung persentase volume realisasi
	if (maxVolume > 0) {
		let persen = (total / maxVolume) * 100;
		console.log(persen);
		
		$("#prosen_vol_real").val(persen.toFixed(2) + " %");
	} else {
		$("#prosen_vol_real").val("0 %");
	}

	console.log(total);
	console.log(maxVolume);
	// console.log(persen);
	
	
	
}

function hitungTotalBeratRealisasi() {
	let total = 0;

	// Loop setiap row pada tabel
	$("#tableDetailBarang tbody tr").each(function () {
		let qty =
			parseFloat(
				$(this).find("input[name^='data'][name$='[qty_realisasi]']").val()
			) || 0;
		let berat = parseFloat($(this).find(".berat-barang").val()) || 0;

		total += qty * berat;
	});

	// Set total berat realisasi
	$("#tot_berat_real").val(total.toFixed(2));

	// Ambil nilai max_payload
	let maxPayload = parseFloat($("#max_payload").val()) || 0;

	// Hitung persentase berat realisasi
	if (maxPayload > 0) {
		let persen = (total / maxPayload) * 100;
		$("#prosen_berat_real").val(persen.toFixed(2) + " %");
	} else {
		$("#prosen_berat_real").val("0 %");
	}
}
