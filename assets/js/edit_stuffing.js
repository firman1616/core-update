$(document).ready(function () {
	// const BASE_URL = window.location.origin + "/";
	// get data buyer
	$("#buyer").select2({
		placeholder: "Pilih Buyer",
		allowClear: true,
		minimumInputLength: 1,
		ajax: {
			url: BASE_URL + "EditStuffing/get_buyer_data",
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
	});

	// get data container
	$("#container")
		.select2({
			placeholder: "Pilih Container/Truck",
			width: "100%",
			allowClear: true,
			ajax: {
				url: BASE_URL + "EditStuffing/get_data_container",
				dataType: "json",
				delay: 250,
				data: function (params) {
					return { term: params.term ? params.term.toUpperCase() : "" };
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
			$("#max_volume").val(selected.max_volume);
			$("#max_payload").val(selected.max_payload);
		});

	// 🔹 Set default value dari atribut data di <select>
	const $select = $("#container");
	const selectedId = $select.data("id");
	const selectedText = $select.data("text");
	const maxVolume = $select.data("max-volume");
	const maxPayload = $select.data("max-payload");

	if (selectedId && selectedText) {
		const option = new Option(selectedText, selectedId, true, true);
		$select.append(option).trigger("change");

		// isi input hidden
		$("#max_volume").val(maxVolume);
		$("#max_payload").val(maxPayload);
	}

	// add row table detail
	$(document).on("click", ".add-row", function () {
		if (!$("#container").val()) {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Silakan pilih Jenis Container/Truck terlebih dahulu!",
			});
			return;
		}

		let newRow = `
	<tr>
		<td></td>
		<td>
			<select name="no_so[]" class="form-control select-no-so" required></select>
		</td>
		<td>
			<input type="text" name="counter_so[]" class="form-control" required>
		</td>
		<td>
			<select name="master_carton[]" class="form-control select-barang" required></select>
			<input type="hidden" name="volume[]" class="form-control">
			<input type="hidden" name="berat_net[]" class="form-control">
			<input type="hidden" name="prod_name[]" class="form-control">
			<input type="hidden" name="prod_kode[]" class="form-control">
			<input type="hidden" name="konv[]" class="form-control">
		</td>
		<td>
			<input type="number" name="qty_mo[]" class="form-control" required>
		</td>
		<td>
			<input type="number" name="qty[]" class="form-control" required>
		</td>
		<td>
			<button type="button" class="btn btn-primary btn-sm add-julian-row">
				<i class="fa fa-plus"></i>
			</button>
			<button type="button" class="btn btn-danger btn-sm delete-row-detail">
				<i class="fa fa-trash"></i>
			</button>
		</td>
	</tr>`;

		let $tbody = $("#table-mc tbody");
		$tbody.append(newRow);

		// 🔹 ambil row terakhir yang baru ditambahkan
		let $newRow = $tbody.find("tr").last();

		// --- SELECT2 No SO ---
		$newRow
			.find(".select-no-so")
			.select2({
				placeholder: "Pilih No SO",
				allowClear: true,
				width: "100%",
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
				let data = e.params.data;
				let $row = $(this).closest("tr");
				$row.find("input[name='counter_so[]']").val(data.counter);
			});

		// --- SELECT2 Barang ---
		$newRow
			.find(".select-barang")
			.select2({
				placeholder: "Pilih Data Barang",
				allowClear: true,
				width: "100%",
				minimumInputLength: 1,
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
				let data = e.params.data;
				let $row = $(this).closest("tr");
				$row.find("input[name='volume[]']").val(data.volume);
				$row.find("input[name='berat_net[]']").val(data.berat_net);
				$row.find("input[name='prod_name[]']").val(data.prod_name);
				$row.find("input[name='prod_kode[]']").val(data.prod_kode);
				$row.find("input[name='konv[]']").val(parseFloat(data.konv) || 0);

				let no_so = $row.find("select[name='no_so[]']").val();
				if (no_so && data.prod_kode) {
					$.get(
						BASE_URL + "Stuffing/get_qty_mo",
						{
							no_op: no_so,
							kode_brg: data.prod_kode,
						},
						function (res) {
							let result = JSON.parse(res);
							$row.find("input[name='qty_mo[]']").val(result.qty_mo);
						}
					);
				}
			});

		// Update total dan nomor urut
		updateRowNumbers();
		updateTotalQty();
		updateTotalVolume();
		updateTotalBerat();
	});

	// tambah data julian jika ada row detail baru
	// ketika tombol add-julian-row di klik (untuk row baru yg belum punya ID di DB)
	$(document).on("click", ".add-julian-row", function () {
		const $row = $(this).closest("tr");
		let detId = $row.data("id"); // kalau belum tersimpan, null
		let tempKey = $row.index(); // gunakan index row sebagai key sementara

		// Kalau row belum punya id di DB, pakai key sementara (prefix "temp_")
		if (!detId) {
			detId = "temp_" + tempKey;
			$row.attr("data-id", detId);
		}

		console.log("➕ Add Julian Row untuk detId:", detId);

		// pastikan array julianTempData tersedia
		if (typeof julianTempData === "undefined") window.julianTempData = {};
		if (!julianTempData[detId]) julianTempData[detId] = [];

		// update tampilan modal julian
		$("#julianBarang").html(`
		<h4 class="mb-1"><strong>Product:</strong> ${
			$row.find("input[name='prod_name[]']").val() || "-"
		}</h4>
		<h3><p class="mb-0"><strong>SO:</strong> ${
			$row.find("select[name='no_so[]']").val() || "-"
		} | <strong>Qty Plan:</strong> ${$row.find("input[name='qty[]']").val() || "-"}</p></h3>
	`);
		// kosongkan isi tabel julian di modal
		const $tbody = $("#julianTable tbody");
		$tbody.empty();

		// render ulang data temp jika sudah ada
		const julianList = julianTempData[detId];
		if (julianList.length > 0) {
			julianList.forEach((j, i) => {
				$tbody.append(`
				<tr>
					<td>${i + 1}</td>
					<td><input type="number" class="form-control form-control-sm" name="no_julian[]" value="${
						j.no_julian || ""
					}" required></td>
					<td><input type="number" class="form-control form-control-sm" name="line[]" value="${
						j.line || ""
					}" required></td>
					<td><input type="number" class="form-control form-control-sm" name="tahun[]" value="${
						j.tahun || new Date().getFullYear()
					}" required></td>
					<td><input type="number" class="form-control form-control-sm text-right" name="qty_julian[]" value="${
						j.qty_julian || ""
					}" required></td>
					<td><input type="date" class="form-control form-control-sm" name="date[]" value="${
						j.date || ""
					}" required></td>
					<td><input type="text" class="form-control form-control-sm" name="keterangan[]" value="${
						j.keterangan || ""
					}"></td>
					<td class="text-center">
						<button type="button" class="btn btn-danger btn-sm delete-julian-row">
							<i class="fa fa-trash"></i>
						</button>
					</td>
				</tr>
			`);
			});
		} else {
			$tbody.append(
				`<tr><td colspan="8" class="text-center text-muted">Belum ada data Julian</td></tr>`
			);
		}

		// simpan det-id ke modal
		$("#julianModal").data("det-id", detId);

		// tampilkan modal
		$("#julianModal").modal("show");
	});

	// load edit julian code
	$(document).on("click", ".julian-row", function () {
		const detId = $(this).data("id");
		console.log("🔸 Button Julian diklik, ID:", detId);

		// 🔹 Pastikan array details tersedia
		if (typeof details === "undefined" || !Array.isArray(details)) {
			console.error("❌ Variabel 'details' tidak tersedia atau bukan array.");
			return;
		}

		// 🔹 Cek apakah julianTempData sudah terisi
		if (typeof julianTempData === "undefined") {
			console.error("❌ Variabel 'julianTempData' belum terdefinisi di view.");
			return;
		}

		// 🔹 Cari data detail berdasarkan id
		const detail = details.find((d) => String(d.id) === String(detId));
		if (!detail) {
			console.error("❌ Detail tidak ditemukan untuk ID:", detId);
			Swal.fire("Warning", "Data detail tidak ditemukan.", "warning");
			return;
		}

		// 🔹 Ambil data julian dari temp (kalau belum ada, buat array kosong)
		const currentJulianData = julianTempData[detId] || [];

		console.log("✅ Detail ditemukan:", detail);
		console.log(
			"📦 Data Julian (temp) untuk detId =",
			detId,
			currentJulianData
		);

		// 🔹 Update info di header modal
		$("#julianBarang").html(`
		<h4 class="mb-1"><strong>Product:</strong> ${detail.prod_name || ""}</h4>
		<h3><p class="mb-0"><strong>SO:</strong> ${
			detail.mo_id || ""
		} | <strong>Qty Plan:</strong> ${detail.qty || ""}</p></h3>
	`);

		// 🔹 Kosongkan tabel sebelum isi ulang
		const $tbody = $("#julianTable tbody");
		$tbody.empty();

		// 🔹 Render baris data julian dari julianTempData
		if (currentJulianData.length > 0) {
			currentJulianData.forEach((j, i) => {
				const row = `
				<tr data-id="${j.id || ""}">
					<td>${i + 1}</td>
					<td><input type="text" class="form-control form-control-sm" name="no_julian[]" value="${
						j.julian || ""
					}" readonly></td>
					<td><input type="text" class="form-control form-control-sm" name="line[]" value="${
						j.line || ""
					}" readonly></td>
					<td><input type="text" class="form-control form-control-sm" name="tahun[]" value="${
						j.tahun || ""
					}" readonly></td>
					<td><input type="text" class="form-control form-control-sm text-right" name="qty_julian[]" value="${
						j.qty || ""
					}" readonly></td>
					<td><input type="date" class="form-control form-control-sm" name="date[]" value="${
						j.date || ""
					}" readonly></td>
					<td><input type="text" class="form-control form-control-sm" name="keterangan[]" value="${
						j.keterangan || ""
					}" readonly></td>
					<td class="text-center">
						<button type="button" class="btn btn-danger btn-sm delete-julian-row">
							<i class="fa fa-trash"></i>
						</button>
					</td>
				</tr>`;
				$tbody.append(row);
			});
		} else {
			$tbody.append(
				`<tr><td colspan="8" class="text-center text-muted">Belum ada data Julian</td></tr>`
			);
		}

		// 🔹 Simpan det-id ke modal untuk referensi simpan nanti
		$("#julianModal").data("det-id", detId);

		// 🔹 Tampilkan modal
		$("#julianModal").modal("show");

		// 🔹 Log data julianTempData untuk debugging
		console.log(
			"🧩 julianTempData (semua):",
			JSON.parse(JSON.stringify(julianTempData))
		);
	});

	// add row julian code
	$(document).on("click", "#addJulianRow", function () {
		const $tbody = $("#julianTable tbody");
		const newIndex = $tbody.find("tr").length + 1;

		$tbody.find(".text-muted").closest("tr").remove();

		// Ambil tahun sekarang
		const currentYear = new Date().getFullYear();

		const newRow = `
	<tr>
		<td>${newIndex}</td>
		<td><input type="number" class="form-control form-control-sm julian-input" name="no_julian[]" required></td>
		<td><input type="number" class="form-control form-control-sm" name="line[]" required></td>
		<td><input type="number" class="form-control form-control-sm tahun-input" name="tahun[]" value="${currentYear}" required></td>
		<td><input type="number" class="form-control form-control-sm text-right" name="qty_julian[]" required></td>
		<td><input type="date" class="form-control form-control-sm date-input" name="date[]" required></td>
		<td><input type="text" class="form-control form-control-sm" name="keterangan[]"></td>
		<td class="text-center">
			<button type="button" class="btn btn-danger btn-sm delete-julian-row">
				<i class="fa fa-trash"></i>
			</button>
		</td>
	</tr>
	`;

		$tbody.append(newRow);
		console.log("🆕 Baris Julian baru ditambahkan");
	});

	// update date from julian code
	$(document).on(
		"input",
		"input[name='no_julian[]'], input[name='tahun[]']",
		function () {
			let row = $(this).closest("tr");
			let julian = parseInt(row.find("input[name='no_julian[]']").val()) || 0;
			let year = parseInt(row.find("input[name='tahun[]']").val()) || 0;

			if (julian > 0 && year > 0) {
				let date = julianToDate(year, julian);
				row.find("input[name='date[]']").val(date);
			}
		}
	);

	// delete row julian code
	$(document).on("click", ".delete-julian-row", function () {
		const id = $(this).closest("tr").data("id");
		if (!id) {
			$(this).closest("tr").remove();
			return;
		}

		Swal.fire({
			title: "Yakin hapus data ini?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "EditStuffing/delete_julian/" + id,
					type: "POST",
					success: function (res) {
						console.log("🗑️ Julian dihapus", res);
						$(`tr[data-id='${id}']`).remove();
					},
				});
			}
		});
	});

	// simpan atau update data julian
	$(document).on("click", "#saveJulianModal", function () {
		const detId = $("#julianModal").data("det-id");
		if (!detId) {
			Swal.fire("Error", "ID Detail tidak ditemukan!", "error");
			return;
		}

		saveJulianToDB(detId);
	});

	// delete detail data dan julian
	$(document).on("click", ".btn-delete-row", function () {
		const $row = $(this).closest("tr");
		const detId = $row.data("id");

		if (!detId) {
			Swal.fire({
				icon: "warning",
				title: "Tidak dapat menghapus",
				text: "Data ini belum tersimpan di database.",
				timer: 1500,
				showConfirmButton: false,
			});
			$row.remove(); // jika hanya baris baru, hapus langsung dari view
			return;
		}

		// 🔸 Konfirmasi dulu
		Swal.fire({
			title: "Yakin ingin menghapus?",
			text: "Data ini dan semua Julian yang terkait akan dihapus permanen.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus!",
			cancelButtonText: "Batal",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "EditStuffing/delete_detail",
					type: "POST",
					dataType: "json",
					data: { det_id: detId },
					success: function (res) {
						if (res.status === "success") {
							Swal.fire({
								icon: "success",
								title: "Terhapus!",
								text: "Data stuffing dan Julian terkait berhasil dihapus.",
								timer: 1200,
								showConfirmButton: false,
							});
							// hapus baris dari tabel
							$row.remove();
							updateRowNumbers();
						} else {
							Swal.fire(
								"Gagal",
								res.message || "Gagal menghapus data.",
								"error"
							);
						}
					},
					error: function (xhr, status, error) {
						console.error("❌ Error hapus detail:", error);
						Swal.fire("Error", "Terjadi kesalahan koneksi ke server.", "error");
					},
				});
			}
		});
	});

	// delete row setelah tambah row baru dengan button add row
	$(document).on("click", ".delete-row-detail", function () {
		const $row = $(this).closest("tr");

		Swal.fire({
			title: "Hapus baris ini?",
			text: "Baris ini belum tersimpan di database.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, hapus",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				$row.remove();
				updateRowNumbers(); // kalau kamu punya fungsi untuk update nomor urut
				Swal.fire({
					icon: "success",
					title: "Dihapus",
					text: "Baris berhasil dihapus dari tampilan.",
					timer: 1000,
					showConfirmButton: false,
				});
			}
		});
	});

	// final submit / update
	// === FINAL SUBMIT / UPDATE HEADER ===
	$(document).on("click", "#update-data", function (e) {
		e.preventDefault();

		Swal.fire({
			title: "Konfirmasi Update",
			text: "Apakah kamu yakin ingin menyimpan perubahan data?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Ya, Update",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				// ambil semua data header dari form
				let formData = $("#formStuffingEdit").serializeArray();
				let headerData = {};
				formData.forEach((f) => (headerData[f.name] = f.value));

				// ambil data detail
				let details = [];
				$("#table-mc tbody tr").each(function () {
					let $row = $(this);
					let detId = $row.data("id") || null;

					// ambil semua field
					let det = {
						id: detId,
						mo_id: $row.find("select[name='no_so[]']").val(),
						// mo_id: $row.find("input[name='no_so[]']").val(),
						counter: $row.find("input[name='counter_so[]']").val(),
						prod_kode: $row.find("input[name='prod_kode[]']").val(),
						prod_name: $row.find("input[name='prod_name[]']").val(),
						qty_mo: $row.find("input[name='qty_mo[]']").val(),
						qty: $row.find("input[name='qty[]']").val(),
						volume: $row.find("input[name='volume[]']").val(),
						berat_net: $row.find("input[name='berat_net[]']").val(),
						konv_bndl: $row.find("input[name='konv[]']").val(),
					};

					// tambahkan julian kalau ada
					if (typeof julianTempData !== "undefined" && julianTempData[detId]) {
						det.julian = julianTempData[detId];
					} else {
						det.julian = [];
					}

					details.push(det);
				});

				let payload = {
					header: headerData,
					details: details,
				};

				console.log("Payload update:", payload);

				$.ajax({
					url: BASE_URL + "EditStuffing/update",
					type: "POST",
					data: JSON.stringify(payload),
					contentType: "application/json",
					beforeSend: function () {
						Swal.fire({
							title: "Menyimpan...",
							text: "Mohon tunggu, data sedang diproses.",
							allowOutsideClick: false,
							didOpen: () => {
								Swal.showLoading();
							},
						});
					},
					success: function (res) {
						if (res.status === "success") {
							Swal.fire({
								icon: "success",
								title: "Berhasil!",
								text: res.message,
								timer: 1500,
								showConfirmButton: false,
							}).then(() => {
								// ✅ Redirect langsung ke halaman Stuffing
								window.location.href = BASE_URL + "Stuffing";
							});
						} else {
							Swal.fire({
								icon: "error",
								title: "Gagal!",
								text: res.message,
							});
						}
					},
					error: function (xhr, status, error) {
						console.error(xhr.responseText);
						Swal.fire({
							icon: "error",
							title: "Error!",
							text: "Terjadi kesalahan pada server.",
						});
					},
				});
			}
		});
	});

	// update qty, volume dan berat
	$(document).on("input", "input[name='qty[]']", function () {
		updateTotalQty();
		updateTotalVolume();
		updateTotalBerat();
	});
	updateTotalQty();
	updateTotalVolume();
	updateTotalBerat();
});

document.addEventListener("DOMContentLoaded", function () {
	let tglStuff = document.getElementById("tgl_stuff");
	if (tglStuff && !tglStuff.value) {
		// hanya isi default current date kalau input masih kosong (buat tambah)
		let today = new Date();
		let day = String(today.getDate()).padStart(2, "0");
		let month = String(today.getMonth() + 1).padStart(2, "0");
		let year = today.getFullYear();

		let currentDate = `${year}-${month}-${day}`;
		tglStuff.value = currentDate;
	}
});

// update total qty plan
function updateTotalQty() {
	let total = 0;
	const inputs = $("input[name='qty[]']");
	console.log("Found qty inputs:", inputs.length);

	inputs.each(function () {
		total += parseFloat($(this).val()) || 0;
	});

	console.log("Total qty =", total);
	$("#total_qty_plan").val(total);
}

// update total volume
function updateTotalVolume() {
	let total = 0;

	$("#table-mc tbody tr").each(function () {
		let volume = parseFloat($(this).find("input[name='volume[]']").val()) || 0;
		let qty = parseFloat($(this).find("input[name='qty[]']").val()) || 0;

		console.log("Row volume:", volume, "qty:", qty);

		total += volume * qty; // total volume = volume x qty
	});

	$("#total_volume").val(total.toFixed(2)); // isi total volume

	// === Update Progress Bar ===
	let maxVolume = parseFloat($("#max_volume").val()) || 0; // ambil dari input hidden/id max_volume
	let percent = maxVolume > 0 ? (total / maxVolume) * 100 : 0;

	// batasi biar max 100%
	if (percent > 100) percent = 100;

	$("#progressVolumeBar")
		.css("width", percent.toFixed(1) + "%")
		.attr("aria-valuenow", percent.toFixed(1))
		.text(percent.toFixed(1) + "%");

	// isi hidden input
	$("#prosen_volume").val(percent.toFixed(1));
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
	let maxPayload = parseFloat($("#max_payload").val()) || 0; // ambil dari input hidden/id max_volume
	let percent = maxPayload > 0 ? (total / maxPayload) * 100 : 0;

	// batasi biar max 100%
	if (percent > 100) percent = 100;

	$("#progressWeightBar")
		.css("width", percent.toFixed(1) + "%")
		.attr("aria-valuenow", percent.toFixed(1))
		.text(percent.toFixed(1) + "%");

	// isi hidden input
	$("#prosen_berat").val(percent.toFixed(1));
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

// fungsi simpan data julian
function saveJulianToDB(detId) {
	const $rows = $("#julianTable tbody tr");
	const dataRows = [];

	$rows.each(function () {
		const $row = $(this);
		const id = $row.data("id") || "";

		// 🔹 support 2 tipe nama input: "no_julian[]" atau "julian[]"
		const noJulian = $row.find("input[name='no_julian[]']").val()?.trim() || "";

		const line = $row.find("input[name='line[]']").val()?.trim() || "";
		const tahun = $row.find("input[name='tahun[]']").val()?.trim() || "";
		const qty =
			$row.find("input[name='qty_julian[]']").val()?.trim() ||
			$row.find("input[name='qty[]']").val()?.trim() ||
			"";

		const date = $row.find("input[name='date[]']").val()?.trim() || "";
		const keterangan =
			$row.find("input[name='keterangan[]']").val()?.trim() || "";

		if (noJulian === "" || line === "") return; // skip incomplete

		dataRows.push({
			id,
			det_stuff_id: detId,
			no_julian: noJulian,
			line: line,
			tahun: tahun,
			qty_julian: qty,
			date: date,
			keterangan: keterangan,
		});
	});

	if (dataRows.length === 0) {
		Swal.fire("Warning", "Tidak ada baris valid untuk disimpan.", "warning");
		return;
	}

	// Jika ID sementara (belum ada di DB)
	if (String(detId).startsWith("temp_")) {
		julianTempData[detId] = dataRows;
		console.log("💾 Disimpan sementara:", julianTempData);

		Swal.fire({
			icon: "success",
			title: "Tersimpan sementara",
			text: "Data Julian berhasil disimpan sementara.",
			timer: 1000,
			showConfirmButton: false,
		});

		$("#julianModal").modal("hide");
		return;
	}

	// Jika ID sudah nyata di DB → simpan langsung via AJAX
	$.ajax({
		url: BASE_URL + "EditStuffing/save_julian",
		type: "POST",
		dataType: "json",
		data: { det_id: detId, items: JSON.stringify(dataRows) },
		success: function (res) {
			if (res.status === "success") {
				Swal.fire({
					icon: "success",
					title: "Berhasil",
					text: "Semua data Julian berhasil disimpan.",
					timer: 1000,
					showConfirmButton: false,
				});
				$("#julianModal").modal("hide");
				setTimeout(() => location.reload(), 1000);
			} else {
				Swal.fire("Gagal", res.message || "Gagal menyimpan Julian", "error");
			}
		},
		error: function (xhr, status, error) {
			console.error("❌ Error simpan Julian:", error);
			Swal.fire("Error", "Terjadi kesalahan koneksi ke server", "error");
		},
	});
}

// function saveJulianToDB(detId) {
// 	const $rows = $("#julianTable tbody tr");
// 	const dataRows = [];

// 	$rows.each(function () {
// 		const $row = $(this);
// 		const id = $row.data("id") || "";
// 		const noJulian = $row.find("input[name='julian[]']").val()?.trim() || "";
// 		const line = $row.find("input[name='line[]']").val()?.trim() || "";
// 		const tahun = $row.find("input[name='tahun[]']").val()?.trim() || "";
// 		const qty = $row.find("input[name='qty_julian[]']").val()?.trim() || "";
// 		const date = $row.find("input[name='date[]']").val()?.trim() || "";
// 		const keterangan =
// 			$row.find("input[name='keterangan[]']").val()?.trim() || "";

// 		if (noJulian === "" || line === "") return; // skip incomplete

// 		dataRows.push({
// 			id,
// 			det_stuff_id: detId,
// 			no_julian: noJulian,
// 			line: line,
// 			tahun: tahun,
// 			qty_julian: qty,
// 			date: date,
// 			keterangan: keterangan,
// 		});
// 	});

// 	if (dataRows.length === 0) {
// 		Swal.fire("Warning", "Tidak ada baris valid untuk disimpan.", "warning");
// 		return;
// 	}

// 	$.ajax({
// 		url: BASE_URL + "EditStuffing/save_julian",
// 		type: "POST",
// 		dataType: "json",
// 		data: { det_id: detId, items: JSON.stringify(dataRows) },
// 		success: function (res) {
// 			if (res.status === "success") {
// 				Swal.fire({
// 					icon: "success",
// 					title: "Berhasil",
// 					text: "Semua data Julian berhasil disimpan.",
// 					timer: 1000,
// 					showConfirmButton: false,
// 				});

// 				// ✅ Hide modal dulu
// 				$("#julianModal").modal("hide");

// 				// ✅ Reload data detail julian (sinkron ke DB)
// 				setTimeout(() => {
// 					location.reload();
// 				}, 1000);
// 			} else {
// 				Swal.fire("Gagal", res.message || "Gagal menyimpan Julian", "error");
// 			}
// 		},
// 		error: function (xhr, status, error) {
// 			console.error("❌ Error simpan Julian:", error);
// 			Swal.fire("Error", "Terjadi kesalahan koneksi ke server", "error");
// 		},
// 	});
// }

// reload julian table
function reloadJulianTable(detId) {
	$.ajax({
		url: BASE_URL + "EditStuffing/get_julian_by_detail/" + detId,
		type: "GET",
		dataType: "json",
		success: function (res) {
			if (res.status === "success") {
				julianTempData[detId] = res.data; // update cache

				console.log("♻️ Data Julian terupdate:", res.data);

				// optional: update tampilan di tabel utama juga
				// updateJulianCount(detId, res.data.length);
			}
		},
		error: function (xhr, status, error) {
			console.error("❌ Error reload Julian:", error);
		},
	});
}

// update row number
function updateRowNumbers() {
	$("#table-mc tbody tr").each(function (index) {
		$(this)
			.find("td:first")
			.text(index + 1);
	});
}
