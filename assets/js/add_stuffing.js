$(document).ready(function () {
	$("#id").val("");
	updateTotalQty();
	// master customer
	$("#buyer").select2({
		placeholder: "Pilih Buyer",
		allowClear: true,
		minimumInputLength: 1,
		ajax: {
			url: BASE_URL + "Stuffing/get_buyer_data",
			dataType: "json",
			delay: 250,
			data: function (params) {
				return {
					q: params.term, // kirim keyword pencarian
				};
			},
			processResults: function (data) {
				return {
					results: data,
				};
			},
			cache: true,
		},
	});

	// get data container
	$("#container_truck")
		.select2({
			placeholder: "Pilih Container/Truck",
			width: "100%",
			ajax: {
				url: BASE_URL + "Stuffing/get_data_container",
				dataType: "json",
				delay: 250,
				data: function (params) {
					return {
						term: params.term ? params.term.toUpperCase() : "",
					};
				},
				processResults: function (data) {
					return {
						results: data.results.map((item) => ({
							id: item.id,
							text: item.text,
							max_volume: item.max_volume,
							max_weight: item.max_weight,
							max_payload: item.max_payload,
						})),
					};
				},
				cache: true,
			},
			minimumInputLength: 1,
		})
		.on("select2:select", function (e) {
			const selected = e.params.data;
			console.log(
				"ID selected (value of select):",
				$("#container_truck").val()
			); // ✅ ini dia
			// console.log("Container selected:", selected);

			// ✅ Simpan nilai ke hidden input
			$("#max_volume").val(selected.max_volume);
			$("#max_payload").val(selected.max_payload);

			// ✅ Update progress bar jika volume/weight sudah dihitung
			refreshProgressBarFromInputs();
		});

	// add row detail
	function updateRowNumbers() {
		$("#table-mc tbody tr").each(function (index) {
			$(this)
				.find("td:first")
				.text(index + 1); // kasih nomor urut di kolom pertama
		});
	}
	// Tambah row baru
	$(document).on("click", ".add-row", function () {
		if (!$("#container_truck").val()) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Silakan pilih Jenis Container/Truck terlebih dahulu!",
			});
			return; // stop fungsi biar row tidak ditambahkan
		}
		var newRow = `
        <tr>
            <td></td>
            <td>
                <select name="no_so[]" class="form-control select-no-so" style="width:100%" required></select>
            </td>
			<td>
                <input type="text" name="counter_so[]" class="form-control" style="width:100%" required>
            </td>
            <td>
			<select name="master_carton[]" class="form-control select-barang" style="width:75%" required></select>
			<input type="hidden" name="volume[]" class="form-control">
			<input type="hidden" name="berat_net[]" class="form-control">
			<input type="hidden" name="prod_name[]" class="form-control">
			<input type="hidden" name="prod_kode[]" class="form-control">
			<input type="hidden" name="konv[]" class="form-control">
            </td>
			<td>
                <input type="number" name="qty_mo[]" class="form-control" style="width:100%" required>
            </td>
            <td><input type="number" name="qty[]" class="form-control" required></td>
            <td>
				<button type="button" class="btn btn-primary btn-sm julian-row"><i class="fa fa-plus"></i></button>
				<button type="button" class="btn btn-danger btn-sm delete-row"><i class="fa fa-trash"></i></button>
			</td>
        </tr>
    `;
		$("#table-mc tbody").append(newRow);

		let $newRow = $("#table-mc tbody tr").last();
		// cek validasi row baru
		checkRowValidity($newRow); // cek pertama kali

		// Apply Select2 ke row baru
		$(".select-no-so")
			.last()
			.select2({
				placeholder: "Pilih No SO",
				allowClear: true,
				minimumInputLength: 1,
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
				// isi input volume sesuai data barang
				row.find("input[name='counter_so[]']").val(data.counter);
			});

		updateRowNumbers();
		updateTotalQty();
		updateTotalVolume();
		updateTotalBerat(); // update nomor urut

		// get data barang
		$(".select-barang")
			.last()
			.select2({
				placeholder: "Pilih Data Barang",
				allowClear: true,
				minimumInputLength: 1,
				width: "100%",
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
					if (!data.text) return data.text;
					return data.text.length > 80
						? data.text.substr(0, 80) + "..."
						: data.text;
				},
				templateSelection: function (data) {
					if (!data.text) return data.text;
					return data.text.length > 80
						? data.text.substr(0, 80) + "..."
						: data.text;
				},
			})
			.on("select2:select", function (e) {
				var data = e.params.data;
				var row = $(this).closest("tr");
				// isi input volume sesuai data barang
				row.find("input[name='volume[]']").val(data.volume);
				row.find("input[name='berat_net[]']").val(data.berat_net);
				row.find("input[name='prod_name[]']").val(data.prod_name);
				row.find("input[name='prod_kode[]']").val(data.prod_kode);
				row.find("input[name='konv[]']").val(isNaN(parseFloat(data.konv)) ? 0 : parseFloat(data.konv));

				var no_so = row.find("select[name='no_so[]']").val();
				if (no_so && data.prod_kode) {
					$.get(
						BASE_URL + "Stuffing/get_qty_mo",
						{
							no_op: no_so,
							kode_brg: data.prod_kode,
						},
						function (res) {
							var result = JSON.parse(res);
							let qty = parseInt(result.qty_mo);
							row.find("input[name='qty_mo[]']").val(qty);
						}
					);
				}
			});

		updateRowNumbers();
		updateTotalQty();
		updateTotalVolume();
		updateTotalBerat(); // update nomor urut
		// update nomor urut
	});

	$(document).on("input", "input[name='qty[]']", function () {
		updateTotalQty();
	});

	$(document).on(
		"input",
		"input[name='volume[]'], input[name='qty[]']",
		function () {
			updateTotalVolume();
		}
	);

	$(document).on(
		"input",
		"input[name='berat_net[]'], input[name='qty[]']",
		function () {
			updateTotalBerat();
		}
	);

	// Hapus row
	$(document).on("click", ".delete-row", function () {
		$(this).closest("tr").remove();
		updateRowNumbers(); // update nomor urut ulang
		updateTotalQty();
		updateTotalVolume();
		updateTotalBerat();
	});

	// modal julian code
	$(document).on("click", ".julian-row", function () {
		let row = $(this).closest("tr");
		let no_so = row.find("select[name='no_so[]']").val();
		let qty = row.find("input[name='qty[]']").val();
		let barang = row
			.find("select[name='master_carton[]'] option:selected")
			.text();

		// Update judul modal
		$("#julianModalLabel").text("Tambah Data untuk SO: " + (no_so || "-"));

		// Simpan Qty Plan ke data attribute biar gampang diakses
		$("#julianInfo")
			.html("<p>Qty Plan : " + (qty || 0) + "</p>")
			.data("qtyPlan", qty || 0);

		$("#julianBarang").html("<p>Nama Barang : " + (barang || "-") + "</p>");
		$("#julianInfoQty").html("<p>Qty Plan Input : 0</p>");

		// buka modal
		$("#julianModal").modal("show");
	});

	// add julian code
	let julianRowIndex = 1;

	$(document).on("click", "#addJulianRow", function () {
		let currentYear = new Date().getFullYear();
		let newRow = `
      <tr>
        <td>${julianRowIndex}</td>
        <td><input type="number" class="form-control julian-code" name="julian[]" required></td>
        <td><input type="number" class="form-control julian-line" name="line[]" required></td>
        <td><input type="number" class="form-control julian-tahun" name="tahun[]" value="${currentYear}" required></td>
        <td><input type="number" class="form-control julian-qty" name="qty_julian[]"></td>
        <td><input type="text" class="form-control julian-date" name="date[]" required></td>
		<td><input type="text" class="form-control julian-keterangan" name="keterangan[]" required></td>
        <td>
          <button type="button" class="btn btn-danger btn-sm delete-julian-row">
            <i class="fa fa-trash"></i>
          </button>
        </td>
      </tr>`;
		$("#julianTable tbody").append(newRow);
		julianRowIndex++;
	});

	$(document).on("click", ".delete-julian-row", function () {
		$(this).closest("tr").remove();

		// reset nomor urut setelah hapus
		julianRowIndex = 1;
		$("#julianTable tbody tr").each(function () {
			$(this).find("td:first").text(julianRowIndex);
			julianRowIndex++;
		});
	});

	$(document).on(
		"change keyup",
		"select[name='no_so[]'], select[name='master_carton[]'], input[name='qty[]']",
		function () {
			let row = $(this).closest("tr");
			checkRowValidity(row);
		}
	);

	// generate date from julian code
	$(document).on(
		"input",
		"input[name='julian[]'], input[name='tahun[]']",
		function () {
			let row = $(this).closest("tr");
			let julian = parseInt(row.find("input[name='julian[]']").val()) || 0;
			let year = parseInt(row.find("input[name='tahun[]']").val()) || 0;

			if (julian > 0 && year > 0) {
				let date = julianToDate(year, julian);
				row.find("input[name='date[]']").val(date);
			}
		}
	);

	// Event: setiap ada perubahan qty_julian di modal
	$(document).on(
		"input",
		"#julianTable input[name='qty_julian[]']",
		function () {
			let totalInput = updateJulianQtyTotal();

			// ambil qty plan dari data-attribute (biar rapi)
			let qtyPlan = parseFloat($("#julianInfo").data("qtyPlan")) || 0;

			// Bandingkan
			if (totalInput > qtyPlan) {
				let lebih = totalInput - qtyPlan;
				Swal.fire({
					icon: "warning",
					title: "Kelebihan Qty",
					text: "Qty kelebihan " + lebih,
				});
			}
		}
	);

	// save julian temporary array
	// Array global untuk simpan data julian sementara
	let julianTempData = {};

	// Ketika klik tombol + di row detail → buka modal
	$(document).on("click", ".julian-row", function () {
		let row = $(this).closest("tr");
		let detStuffId = row.index(); // sementara pakai index row, nanti bisa ganti pakai ID detail

		let no_so = row.find("select[name='no_so[]']").val();
		let qtyPlan = row.find("input[name='qty[]']").val();
		let barang = row
			.find("select[name='master_carton[]'] option:selected")
			.text();

		// Simpan detStuffId agar tahu data julian ini milik row yang mana
		$("#julianModal").data("detStuffId", detStuffId);

		// Update modal info
		$("#julianModalLabel").text("Tambah Data Julian - SO: " + (no_so || "-"));
		$("#julianBarang").html("<p>Nama Barang : " + (barang || "-") + "</p>");
		$("#julianInfo").html("<p>Qty Plan : " + (qtyPlan || 0) + "</p>");

		// Reset tabel modal
		$("#julianTable tbody").empty();

		// Kalau sudah ada data julian sebelumnya untuk row ini, tampilkan kembali
		if (julianTempData[detStuffId]) {
			julianTempData[detStuffId].forEach((item, i) => {
				let newRow = `
				<tr>
					<td>${i + 1}</td>
					<td><input type="number" class="form-control" name="julian[]" value="${
						item.julian
					}" required></td>
					<td><input type="number" class="form-control" name="line[]" value="${
						item.line
					}" required></td>
					<td><input type="number" class="form-control" name="tahun[]" value="${
						item.tahun
					}" required></td>
					<td><input type="number" class="form-control" name="qty_julian[]" value="${
						item.qty
					}" required></td>
					<td><input type="date" class="form-control" name="date[]" value="${
						item.date
					}" required></td>
					<td><input type="text" class="form-control" name="keterangan[]" value="${
						item.keterangan
					}" required></td>
					<td><button type="button" class="btn btn-danger btn-sm delete-julian-row"><i class="fa fa-trash"></i></button></td>
				</tr>`;
				$("#julianTable tbody").append(newRow);
			});
		}

		// buka modal
		$("#julianModal").modal("show");
	});

	$(document).on("click", "#saveJulianModal", function () {
		let detStuffId = $("#julianModal").data("detStuffId");

		if (detStuffId === undefined) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "Tidak bisa menyimpan data Julian, row tidak dikenali.",
			});
			return;
		}

		// Kumpulkan semua data di tabel modal
		let tempRows = [];
		$("#julianTable tbody tr").each(function () {
			let row = $(this);

			let julian = row.find("input[name='julian[]']").val();
			let line = row.find("input[name='line[]']").val();
			let qty = row.find("input[name='qty_julian[]']").val();

			// cek validasi wajib
			if (!julian || !line || !qty) {
				isValid = false;
				Swal.fire({
					icon: "warning",
					title: "Form Belum Lengkap",
					text: `Row ke-${
						index + 1
					} masih ada field yang kosong (Julian, Line, atau Qty).`,
				});
				return false; // keluar dari .each()
			}

			tempRows.push({
				julian: row.find("input[name='julian[]']").val(),
				line: row.find("input[name='line[]']").val(),
				tahun: row.find("input[name='tahun[]']").val(),
				qty: row.find("input[name='qty_julian[]']").val(),
				date: row.find("input[name='date[]']").val(),
				keterangan: row.find("input[name='keterangan[]']").val(),
			});
		});

		// Simpan ke array global sesuai detStuffId
		julianTempData[detStuffId] = tempRows;

		console.log("Julian data sementara:", julianTempData);

		// Tutup modal
		$("#julianModal").modal("hide");

		Swal.fire({
			icon: "success",
			title: "Data Julian Disimpan",
			showConfirmButton: false,
			timer: 1200,
		});
	});

	// fungsi simpan data
	$(document).on("click", "#save-data", function (e) {
		e.preventDefault();

		// Ambil value form
		let buyer = $("#buyer").val();
		let tipeTransportasi = $("#tipe_transportasi").val();
		let containerTruck = $("#container_truck").val();
		let komoditas = $("#komoditas").val();

		// Cek form satu per satu
		if (!buyer) {
			Swal.fire({
				icon: "warning",
				title: "Form Belum Lengkap",
				text: "Buyer harus dipilih!",
				showConfirmButton: true,
			});
			return;
		}

		if (!tipeTransportasi) {
			Swal.fire({
				icon: "warning",
				title: "Form Belum Lengkap",
				text: "Tipe Transportasi harus dipilih!",
				showConfirmButton: true,
			});
			return;
		}

		if (!containerTruck) {
			Swal.fire({
				icon: "warning",
				title: "Form Belum Lengkap",
				text: "Container / Truck harus dipilih!",
				showConfirmButton: true,
			});
			return;
		}

		if (!komoditas) {
			Swal.fire({
				icon: "warning",
				title: "Form Belum Lengkap",
				text: "Jenis Komoditas harus dipilih!",
				showConfirmButton: true,
			});
			return;
		}

		// Data header (form)
		let headerData = $("#formStuffing").serializeArray();
		let headerObj = {};
		headerData.forEach((item) => (headerObj[item.name] = item.value));

		// Data detail (ambil semua row dari #table-mc)
		let details = [];
		$("#table-mc tbody tr").each(function (i, row) {
			let detail = {
				no_so: $(row).find("select[name='no_so[]']").val(),
				counter: $(row).find("input[name='counter_so[]']").val(),
				prod_kode: $(row).find("input[name='prod_kode[]']").val(), // ambil hidden input
				prod_name: $(row).find("input[name='prod_name[]']").val(), // ambil hidden input
				volume: $(row).find("input[name='volume[]']").val(),
				berat_net: $(row).find("input[name='berat_net[]']").val(),
				qty: $(row).find("input[name='qty[]']").val(),
				qty_mo: $(row).find("input[name='qty_mo[]']").val(),
				konv: $(row).find("input[name='konv[]']").val(),
				julian: julianTempData[i] || [], // array sementara julian
			};
			details.push(detail);
		});

		// Gabung semua
		let payload = {
			header: headerObj,
			details: details,
		};

		console.log("Payload before send:", payload);

		$.ajax({
			url: BASE_URL + "Stuffing/save",
			type: "POST",
			data: JSON.stringify(payload), // kirim JSON
			contentType: "application/json", // ini penting!
			dataType: "json",
			success: function (res) {
				if (res.status === "success") {
					Swal.fire({
						icon: "success",
						title: "Berhasil",
						text: res.message,
						showConfirmButton: false, // sembunyikan tombol OK
						timer: 1500, // 2 detik lalu otomatis close
					}).then(() => {
						window.location.href = BASE_URL + "Stuffing";
					});
				} else {
					Swal.fire("Gagal", res.message, "error");
				}
			},
			error: function (xhr, status, error) {
				Swal.fire("Error", "Terjadi kesalahan: " + error, "error");
			},
		});
	});
});

document.addEventListener("DOMContentLoaded", function () {
	let today = new Date();
	let day = String(today.getDate()).padStart(2, "0");
	let month = String(today.getMonth() + 1).padStart(2, "0"); // bulan mulai dari 0
	let year = today.getFullYear();

	let currentDate = `${year}-${month}-${day}`;
	document.getElementById("tgl_stuff").value = currentDate;
});

// update total qty plan
function updateTotalQty() {
	let total = 0;
	$("input[name='qty[]']").each(function () {
		let val = parseFloat($(this).val()) || 0;
		total += val;
	});
	$("#total_qty_plan").val(total);
}

// update total volume
function updateTotalVolume() {
	let total = 0;

	$("#table-mc tbody tr").each(function () {
		let volume = parseFloat($(this).find("input[name='volume[]']").val()) || 0;
		let qty = parseFloat($(this).find("input[name='qty[]']").val()) || 0;

		total += volume * qty; // total volume = volume x qty
	});

	$("#total_volume").val(total.toFixed(3)); // isi total volume

	// === Update Progress Bar ===
	let maxVolume = parseFloat($("#max_volume").val()) || 0; // ambil dari input hidden/id max_volume
	let percent = maxVolume > 0 ? (total / maxVolume) * 100 : 0;

	// batasi biar max 100%
	if (percent > 100) percent = 100;

	$("#progressVolumeBar")
		.css("width", percent.toFixed(1) + "%")
		.attr("aria-valuenow", percent.toFixed(2))
		.text(percent.toFixed(2) + "%");

	// isi hidden input
	$("#prosen_volume").val(percent.toFixed(2));

	console.log(total);
	console.log(maxVolume);
	console.log(percent);
	
	
	

	// === SweetAlert jika penuh 100% ===
	if (percent >= 100) {
		Swal.fire({
			icon: "warning",
			title: "Volume Penuh!",
			text: "Container sudah mencapai 100% kapasitas.",
		});
	}
}

// update total berat
function updateTotalBerat() {
	let total = 0;

	$("#table-mc tbody tr").each(function () {
		let berat_net =
			parseFloat($(this).find("input[name='berat_net[]']").val()) || 0;
		let qty = parseFloat($(this).find("input[name='qty[]']").val()) || 0;

		total += berat_net * qty; // total berat = berat x qty
	});

	$("#total_weight").val(total.toFixed(3)); // bisa disesuaikan berapa decimal

	// === Update Progress Bar ===
	let masPayload = parseFloat($("#max_payload").val()) || 0; // ambil dari input hidden/id max_volume
	let percent = masPayload > 0 ? (total / masPayload) * 100 : 0;

	// batasi biar max 100%
	if (percent > 100) percent = 100;

	$("#progressWeightBar")
		.css("width", percent.toFixed(2) + "%")
		.attr("aria-valuenow", percent.toFixed(2))
		.text(percent.toFixed(1) + "%");

	// isi hidden input
	$("#prosen_berat").val(percent.toFixed(2));
}

// cek validasi
function checkRowValidity(row) {
	let no_so = row.find("select[name='no_so[]']").val();
	let master_carton = row.find("select[name='master_carton[]']").val();
	let qty = row.find("input[name='qty[]']").val();

	// Jika salah satu kosong -> disable button
	if (!no_so || !master_carton || !qty) {
		row.find(".julian-row").prop("disabled", true);
	} else {
		row.find(".julian-row").prop("disabled", false);
	}
}

// fungsi julain code
function julianToDate(year, julian) {
	let date = new Date(year, 0); // 1 Jan
	date.setDate(julian); // tambahkan hari
	return date.toISOString().split("T")[0]; // format YYYY-MM-DD
}

// qty julian
function updateJulianQtyTotal() {
	let total = 0;

	$("#julianTable tbody tr").each(function () {
		let val = parseFloat($(this).find("input[name='qty_julian[]']").val()) || 0;
		total += val;
	});

	// tampilkan total ke div
	$("#julianInfoQty").html("<p>Qty Plan Input : " + total + "</p>");

	return total;
}
