$(document).ready(function () {
	// 🔹 Load data default (30 hari terakhir stuffing)
	tableLaporan(getDefaultStartDate(), getDefaultEndDate(), null, null, "stuff");

	// 🔹 Tombol Filter
	$(document).on("click", "#btn-Filter", function () {
		let date_start = $('input[name="date_start"]').val();
		let date_end = $('input[name="date_end"]').val();
		let etd_start = $('input[name="etd_start"]').val();
		let etd_end = $('input[name="etd_end"]').val();
		let buyer = $('input[name="buyer"]').val();
		let counter_buyer = $('input[name="counter_buyer"]').val();

		// 🔸 Validasi buyer dan counter buyer
		if (buyer && counter_buyer) {
			Swal.fire({
				icon: "warning",
				title: "Input Tidak Valid",
				text: "Isi salah satu antara Buyer atau Counter Buyer.",
			});
			return;
		}

		// 🔸 Tentukan prioritas filter
		let filter_type = "stuff"; // default
		if (etd_start && etd_end) {
			filter_type = "etd";
		}

		// 🔸 Jalankan filter sesuai kondisi
		tableLaporan(
			date_start,
			date_end,
			etd_start,
			etd_end,
			filter_type,
			buyer,
			counter_buyer
		);
	});

	// 🔹 Tombol Reset
	$(document).on("click", "#btn-Reset", function () {
		let start = getDefaultStartDate();
		let end = getDefaultEndDate();

		$('input[name="date_start"]').val(start);
		$('input[name="date_end"]').val(end);
		$('input[name="etd_start"]').val("");
		$('input[name="etd_end"]').val("");
		$('input[name="buyer"]').val("");
		$('input[name="counter_buyer"]').val("");

		tableLaporan(start, end, null, null, "stuff");
	});

	$("#btn-export").on("click", function () {
		// Ambil semua input dari form filter
		let formData = $("#formFilter").serialize();

		// Buat form dinamis untuk POST dan buka di tab baru
		let form = $("<form>", {
			action: BASE_URL + "Lap_Stuffing/export_excel",
			method: "POST",
			target: "_blank",
		}).appendTo("body");

		// Tambahkan semua input dari formFilter
		formData.split("&").forEach(function (item) {
			let [name, value] = item.split("=");
			$("<input>")
				.attr({
					type: "hidden",
					name: decodeURIComponent(name),
					value: decodeURIComponent(value),
				})
				.appendTo(form);
		});

		// Submit form dan hapus dari DOM
		form.submit();
		form.remove();
	});
});

// 🔹 Fungsi utama load tabel
function tableLaporan(
	date_start,
	date_end,
	etd_start,
	etd_end,
	filter_type,
	buyer = "",
	counter_buyer = ""
) {
	// 🔸 Validasi input buyer dan counter buyer
	if (buyer && counter_buyer) {
		Swal.fire({
			icon: "warning",
			title: "Input Tidak Valid",
			text: "Isi salah satu antara Buyer atau Counter Buyer.",
		});
		return;
	}

	// 1️⃣ Jika SEMUA filter kosong → tampilkan data default (tgl_stuff 30 hari)
	if (
		!buyer &&
		!counter_buyer &&
		!etd_start &&
		!etd_end &&
		!date_start &&
		!date_end
	) {
		date_start = getDefaultStartDate();
		date_end = getDefaultEndDate();
		filter_type = "stuff";
	}

	// 2️⃣ Jika ETD diisi → tampilkan data sesuai tgl_etd
	else if (etd_start && etd_end && !buyer && !counter_buyer) {
		filter_type = "etd";
	}

	// 3️⃣ Jika buyer/counter diisi & ETD kosong → tampilkan data sesuai tgl_stuff
	else if ((buyer || counter_buyer) && !etd_start && !etd_end) {
		filter_type = "stuff";
	}

	// 4️⃣ Jika buyer/counter diisi & ETD diisi → tampilkan data sesuai tgl_etd
	else if ((buyer || counter_buyer) && etd_start && etd_end) {
		filter_type = "etd";
	}

	$("#div-table-laporan").html('<p class="text-center">Memuat data...</p>');

	$.ajax({
		url: BASE_URL + "Lap_Stuffing/tableLaporan",
		type: "POST",
		dataType: "json",
		data: {
			filter_type: filter_type,
			date_start: date_start,
			date_end: date_end,
			etd_start: etd_start,
			etd_end: etd_end,
			buyer: buyer,
			counter_buyer: counter_buyer,
		},
		success: function (res) {
			if (res.status === "success") {
				$("#div-table-laporan").html(res.html);
			} else if (res.status === "empty") {
				Swal.fire({
					icon: "info",
					title: "Data Tidak Ada",
					text: res.message,
				});
				$("#div-table-laporan").html(
					'<p class="text-center text-danger">' + res.message + "</p>"
				);
			} else if (res.status === "error") {
				Swal.fire({
					icon: "error",
					title: "Kesalahan Input",
					text: res.message,
				});
			}
		},
		error: function () {
			$("#div-table-laporan").html(
				'<p class="text-center text-danger">Terjadi kesalahan saat memuat data.</p>'
			);
		},
	});
}

// 🔹 Fungsi bantu untuk default tanggal
function getDefaultStartDate() {
	let date = new Date();
	date.setDate(date.getDate() - 30);
	return date.toISOString().split("T")[0];
}

function getDefaultEndDate() {
	let date = new Date();
	return date.toISOString().split("T")[0];
}
