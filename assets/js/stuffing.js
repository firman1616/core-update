$(document).ready(function () {
	tableStuffing();

	// detail modal
	$(document).on("click", ".view-detail", function () {
		let id = $(this).data("id");

		$.ajax({
			url: BASE_URL + "Stuffing/get_detail_modal/" + id,
			type: "GET",
			dataType: "json",
			success: function (res) {
				if (res.header) {
					let header = res.header;
					let items = res.items;

					// set title modal
					$("#modalTitle").text(header.kd_stuff + " - " + header.buyer);

					// isi field modal
					$("#tgl_stuffing").text(header.tgl_stuff);
					$("#transportasi").text(header.trans_type);
					$("#jenis_container").text(header.container);
					$("#tipe_komoditas").text(header.tipe_komo);
					$("#qty_plan").text(
						Number(header.tot_qty_plan).toLocaleString("id-ID")
					);
					$("#qty_real").text(
						Number(header.tot_qty_real).toLocaleString("id-ID")
					);
					$("#volume_plan").text(formatNumber(header.volume));
					$("#volume_real").text(formatNumber(header.volume_real));
					$("#berat_plan").text(formatNumber(header.berat));
					$("#berat_real").text(formatNumber(header.berat_real));
					$("#prosentase_volume_plan").text(
						formatNumber(header.prosen_volume) + "%"
					);
					$("#prosen_volume_real").text(
						formatNumber(header.prosen_volume_real) + "%"
					);
					$("#prosentase_berat_plan").text(
						formatNumber(header.prosen_berat) + "%"
					);
					$("#prosentase_berat_real").text(
						formatNumber(header.prosen_berat_real) + "%"
					);
					$("#no_container").text(header.no_container);
					$("#no_seal_container").text(header.no_seal_container);
					$("#buyer").text(header.buyer);
					$("#tujuan").text(header.tujuan);
					$("#counter_buyer").text(header.counter_buyer);

					// hitung selisih
					let selisihVol = (
						header.prosen_volume_real - header.prosen_volume
					).toFixed(2);
					let selisihBerat = (
						header.prosen_berat_real - header.prosen_berat
					).toFixed(2);

					$("#selisih_volume").text(selisihVol + "%");
					$("#selisih_berat").text(selisihBerat + "%");

					$("#keterangan").html(header.keterangan);

					// TODO: render detail items kalau ada table detail di modal
					// contoh:
					let grouped = {};
					items.forEach((item) => {
						let key = item.mo_id + "|" + item.counter + "|" + item.prod_kode;
						if (!grouped[key]) {
							grouped[key] = {
								...item,
								details: [],
							};
						}
						grouped[key].details.push({
							no_julian: item.no_julian,
							line: item.line,
							tahun: item.tahun,
							qty_julian: item.qty_julian,
							date: item.date,
							keterangan: item.keterangan,
						});
					});

					// Render ke table
					let html = "";
					let idx = 1;
					Object.values(grouped).forEach((group) => {
						let rowspan = group.details.length;

						group.details.forEach((det, i) => {
							html += `<tr>`;
							if (i === 0) {
								// kolom utama di merge pakai rowspan
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${idx++}</td>`;
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${group.mo_id}</td>`;
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${group.counter}</td>`;
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${group.prod_kode}</td>`;
								html += `<td style="border:1px solid black; text-align:left;" rowspan="${rowspan}">${group.prod_name}</td>`;
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${formatNumber(
									group.qty
								)}</td>`;
								html += `<td style="border:1px solid black;" rowspan="${rowspan}">${formatNumber(
									group.qty_realisasi
								)}</td>`;
							}
							// kolom detail tracecode
							html += `<td style="border:1px solid black;">${det.no_julian}</td>`;
							html += `<td style="border:1px solid black;">${det.line}</td>`;
							html += `<td style="border:1px solid black;">${det.tahun}</td>`;
							html += `<td style="border:1px solid black;">${formatNumber(det.qty_julian)}</td>`;
							html += `<td style="border:1px solid black;">${det.date}</td>`;
							html += `<td style="border:1px solid black;">${
								det.keterangan || ""
							}</td>`;
							html += `</tr>`;
						});
					});

					$("#tableDetail tbody").html(html);

					// show modal
					$("#modalDetail").modal("show");
				} else {
					Swal.fire("Error", "Data tidak ditemukan", "error");
				}
			},
			error: function (xhr, status, error) {
				Swal.fire("Error", "Terjadi kesalahan: " + error, "error");
			},
		});
	});

	// update progress
	$(document).on("click", ".btn-progress", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Konfirmasi",
			text: "Apakah Anda yakin ingin approve progress ini?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Yes",
			cancelButtonText: "No",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/update_progress",
					type: "POST",
					data: {
						id: id,
					},
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire("Berhasil!", res.message, "success").then(() => {
								tableStuffing();
							});
						} else {
							Swal.fire("Gagal!", res.message, "error");
						}
					},
					error: function (xhr, status, error) {
						Swal.fire("Error", "Terjadi kesalahan: " + error, "error");
					},
				});
			}
		});
	});

	// approve mkt
	$(document).on("click", ".btn-mkt", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Konfirmasi",
			text: "Prosentase volume di bawah 90%, apakah yakin ingin melanjutkan progress selanjutnya?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, lanjutkan!",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/update_progress",
					type: "POST",
					data: { id: id },
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire({
								icon: "success",
								title: "Berhasil!",
								text: res.message,
								timer: 1500,
								showConfirmButton: false,
							}).then(() => {
								tableStuffing(); // 🔄 reload table setelah update
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
						Swal.fire({
							icon: "error",
							title: "Error",
							text: "Terjadi kesalahan: " + error,
						});
					},
				});
			}
		});
	});

	$(document).on("click", ".btn-reject", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Reject Realisasi",
			html: `
            <textarea id="rejectReason" class="swal2-textarea" 
                      placeholder="Tuliskan alasan reject..." 
                      rows="4"></textarea>
        `,
			showCancelButton: true,
			confirmButtonText: "Reject",
			cancelButtonText: "Batal",
			preConfirm: () => {
				let reason = $("#rejectReason").val().trim();
				if (!reason) {
					Swal.showValidationMessage("Keterangan wajib diisi!");
				}
				return { reason: reason };
			},
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/reject_realisasi",
					type: "POST",
					data: {
						id: id,
						reason: result.value.reason,
					},
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire("Berhasil", res.message, "success").then(() => {
								// reload datatable atau page
								tableStuffing();
							});
						} else {
							Swal.fire("Gagal", res.message, "error");
						}
					},
					error: function () {
						Swal.fire("Error", "Terjadi kesalahan server!", "error");
					},
				});
			}
		});
	});

	$(document).on("click", ".btn-reopen", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Re-Open Data?",
			text: "Data yang direject akan dibuka kembali.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Ya, Re-Open",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/reopen",
					type: "POST",
					data: { id: id },
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire("Berhasil", res.message, "success");
							tableStuffing(); // reload table
						} else {
							Swal.fire("Gagal", res.message, "error");
						}
					},
					error: function () {
						Swal.fire("Error", "Terjadi kesalahan server!", "error");
					},
				});
			}
		});
	});

	// cancel data
	$(document).on("click", ".btn-cancel", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Apakah Anda yakin?",
			text: "Data ini akan di-Cancel !",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#6c757d",
			confirmButtonText: "Ya, Cancel!",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/cancel_data",
					type: "POST",
					data: { id: id },
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire("Berhasil", res.message, "success");
							tableStuffing(); // reload table
						} else {
							Swal.fire("Gagal", res.message, "error");
						}
					},
					error: function () {
						Swal.fire("Error", "Terjadi kesalahan server!", "error");
					},
				});
			}
		});
	});

	// approve final
	// Approve data stuffing
	$(document).on("click", ".btn-approve", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Konfirmasi",
			text: "Apakah anda yakin proses realisasi pemuatan Container sudah Selesai ?",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Ya, Approve",
			cancelButtonText: "Batal",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/update_status",
					type: "POST",
					data: {
						id: id,
						status: 5, // DONE
					},
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire("Berhasil", res.message, "success");
							if (typeof tableStuffing === "function") {
								tableStuffing(); // reload table
							}
						} else {
							Swal.fire("Gagal", res.message, "error");
						}
					},
					error: function () {
						Swal.fire("Error", "Terjadi kesalahan server!", "error");
					},
				});
			}
		});
	});

	// btn reset
	$(document).on("click", ".btn-reset", function () {
		let id = $(this).data("id");

		Swal.fire({
			title: "Yakin ingin reset?",
			text: "Status akan direset ke Draft",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Ya, reset!",
		}).then((result) => {
			if (result.isConfirmed) {
				$.ajax({
					url: BASE_URL + "Stuffing/reset_status/" + id,
					type: "POST",
					dataType: "json",
					success: function (res) {
						if (res.status === "success") {
							Swal.fire({
								icon: "success",
								title: "Berhasil",
								text: res.message,
								showConfirmButton: false,
								timer: 1500,
							});
							// reload tabel kalau ada
							if (typeof tableStuffing !== "undefined") {
								// tableStuffing.ajax.reload();
								tableStuffing();
							}
							// location.reload();
						} else {
							Swal.fire({
								icon: "error",
								title: "Gagal",
								text: res.message,
							});
						}
					},
					error: function () {
						Swal.fire({
							icon: "error",
							title: "Oops...",
							text: "Terjadi kesalahan pada server",
						});
					},
				});
			}
		});
	});

	// v_edit
	// redirect ke halaman edit saat tombol .btn-edit diklik
	// $(document).on("click", ".btn-edit", function () {
	// 	var id = $(this).data("id");

	// 	if (!id) {
	// 		Swal.fire("Error", "ID tidak ditemukan.", "error");
	// 		return;
	// 	}

	// 	console.log("Klik Edit Stuffing, ID:", id);

	// 	// Ambil semua detail stuffing
	// 	$.ajax({
	// 		url: BASE_URL + "Stuffing/get_detail_stuff/" + id,
	// 		type: "GET",
	// 		dataType: "json",
	// 		success: function (detailRes) {
	// 			console.log("📦 Detail Stuffing:", detailRes);

	// 			let debugData = {
	// 				id_stuff: id,
	// 				details: detailRes,
	// 				julians: [],
	// 			};

	// 			// Loop ambil Julian per detail
	// 			let ajaxCalls = detailRes.map((d) => {
	// 				return $.ajax({
	// 					url: BASE_URL + "Stuffing/get_julian_data/" + d.id,
	// 					type: "GET",
	// 					dataType: "json",
	// 					success: function (julianRes) {
	// 						debugData.julians.push({
	// 							det_id: d.id,
	// 							data: julianRes,
	// 						});
	// 					},
	// 				});
	// 			});

	// 			// Tunggu semua request selesai
	// 			$.when.apply($, ajaxCalls).done(function () {
	// 				console.log("✅ Semua Julian berhasil diambil:");
	// 				console.log(debugData);

	// 				// Simpan ke localStorage (kalau nanti mau dipakai di halaman edit)
	// 				localStorage.setItem("julian_debug", JSON.stringify(debugData));

	// 				Swal.fire({
	// 					icon: "success",
	// 					title: "Berhasil Load Data",
	// 					text: "Cek console untuk hasil lengkap",
	// 					showConfirmButton: true,
	// 				});
	// 			});
	// 		},
	// 		error: function (xhr, status, error) {
	// 			console.error("Gagal ambil detail stuffing:", error);
	// 			Swal.fire("Error", "Gagal ambil data stuffing.", "error");
	// 		},
	// 	});
	// });

	$(document).on("click", ".btn-edit", function () {
		var id = $(this).data("id");
		if (!id) {
			Swal.fire("Error", "ID tidak ditemukan.", "error");
			return;
		}
		// redirect ke controller Stuffing/edit_data/{id}
		window.location.href = BASE_URL + "EditStuffing/v_edit/" + id;
	});

	$(document).on("click", ".print", function () {
		var id = $(this).data("id");
		window.open(BASE_URL + "Stuffing/cetak_breakdown/" + id, "_blank");
	});

	$(document).on("click", ".print-break-exim", function () {
		var id = $(this).data("id");
		window.open(BASE_URL + "Stuffing/cetak_breakdown_exim/" + id, "_blank");
	});

	// cek no container dan no seal
	$(document).on("click", ".no_container", function () {
		let id = $(this).data("id");
		$("#id_container").val(id);
		$("#formContainer")[0].reset(); // reset form
		$("#modalContainer").modal("show");
	});

	// update no container dan no seal container
	$("#formContainer").submit(function (e) {
		e.preventDefault();

		let id = $("#id_container").val();
		let no_container = $("#no_container").val();
		let no_seal = $("#no_seal").val();

		// if (no_container === "" || no_seal === "") {
		// 	Swal.fire("Peringatan", "Semua field wajib diisi!", "warning");
		// 	return;
		// }

		// Langkah 1️⃣: Cek duplikasi dulu
		$.ajax({
			url: BASE_URL + "Stuffing/cek_unique_container",
			type: "POST",
			data: {
				no_container: no_container,
				no_seal: no_seal,
				id: id, // kirim id supaya record sendiri tidak ikut terdeteksi
			},
			dataType: "json",
			success: function (res) {
				if (res.status === "duplicate") {
					// Kalau ada duplikasi
					let messages = res.data.map((item) => item.msg).join("<br>");
					Swal.fire({
						icon: "error",
						title: "Duplikasi Data",
						html: messages,
					});
				} else {
					// Langkah 2️⃣: Jika aman, baru lanjut update data
					$.ajax({
						url: BASE_URL + "Stuffing/update_container",
						type: "POST",
						data: {
							id: id,
							no_container: no_container,
							no_seal: no_seal,
						},
						dataType: "json",
						success: function (res) {
							if (res.status === "success") {
								Swal.fire({
									icon: "success",
									title: "Berhasil!",
									text: res.message,
									timer: 1500,
									showConfirmButton: false,
								});
								$("#modalContainer").modal("hide");
								tableStuffing(); // reload tabel
							} else {
								Swal.fire({
									icon: "error",
									title: "Gagal!",
									text: res.message,
								});
							}
						},
						error: function (xhr, status, error) {
							Swal.fire({
								icon: "error",
								title: "Error!",
								text: "Terjadi kesalahan: " + error,
							});
						},
					});
				}
			},
			error: function (xhr, status, error) {
				Swal.fire({
					icon: "error",
					title: "Error!",
					text: "Gagal mengecek data unik: " + error,
				});
			},
		});
	});

	// Saat tombol Refresh diklik
	$(document).on("click", "#btnRefreshTable", function () {
		// Tampilkan loading kecil biar user tahu sedang refresh
		Swal.fire({
			title: "Merefresh data...",
			timer: 1000,
			didOpen: () => {
				Swal.showLoading();
			},
			willClose: () => {
				tableStuffing(); // panggil ulang fungsi table
			},
		});
	});
});

function tableStuffing() {
	$.ajax({
		url: BASE_URL + "Stuffing/tableStuffing",
		type: "POST",
		dataType: "json",
		success: function (res) {
			$("#div-table-stuffing").html(res.html);

			let table = $("#tableStuffing").DataTable({
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
					<a href="${BASE_URL}Stuffing/v_tambah" 
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

function formatNumber(value) {
	return Number(value).toLocaleString("id-ID", {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}
