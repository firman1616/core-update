$(document).ready(function () {
	tableRole();
	$("#id").val("");
	$("#roleForm").trigger("reset");

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#roleForm").serialize(),
			url: BASE_URL + "Role/store",
			type: "POST",
			datatype: "json",
			success: function (data) {
				$("#roleForm").trigger("reset");
				Swal.fire({
					title: "Good job!",
					text: "Data Berhasil disimpan!",
					icon: "success",
					timer: 1500,
					showConfirmButton: false,
				});
				tableRole();
				$("#cancel-edit").hide();
			},
			error: function (data) {
				console.log("Error:", data);
				$("$save-data").html("Simpan Data");
			},
		});
	});

	$("body").on("click", ".edit", function (e) {
		var id = $(this).data("id");
		$.ajax({
			url: BASE_URL + "Role/vedit/" + id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// console.log(data);
				$("#id").val(id);
				$("#nama_role").val(data.nama_role);
			},
		});
		$("#cancel-edit").show();
	});

	$("#cancel-edit").on("click", function () {
		// Reset form
		$("#roleForm")[0].reset();

		// Sembunyikan tombol cancel
		$(this).hide();
	});

	$("body").on("click", ".akses", function () {
		var id = $(this).data("id");
		console.log("DEBUG ROLE ID:", id);
		$("#role_id").val(id);

		// Reset semua checkbox
		$('#aksesForm input[type="checkbox"]')
			.not("#aksesAll")
			.prop("checked", false);
		$("#aksesAll").prop("checked", false);
		$("#approve-levels input[type='checkbox']").prop("checked", false);
		$("#approve-levels").hide();

		// === Ambil akses modul lama ===
		$.get(BASE_URL + "Role/get_akses/" + id, function (res) {
			var akses = JSON.parse(res);
			akses.forEach(function (a) {
				$('#aksesForm input[type="checkbox"][value="' + a + '"]').prop(
					"checked",
					true
				);
			});

			// Kalau akses Approve dicentang, tampilkan approve-levels
			if (akses.includes("5")) {
				$("#approve-levels").show();
			}

			// Update checkbox ALL
			var total = $('#aksesForm input[type="checkbox"]').not(
				"#aksesAll"
			).length;
			var checked = $('#aksesForm input[type="checkbox"]:checked').not(
				"#aksesAll"
			).length;
			$("#aksesAll").prop("checked", total === checked);
		});

		// === Ambil approve level lama ===
		$.get(BASE_URL + "Role/get_approve_level/" + id, function (res) {
			var levels = JSON.parse(res);

			console.log("DEBUG APPROVE LEVELS ROLE", id, levels);

			// reset dulu
			$('#approve-levels input[type="checkbox"]').prop("checked", false);

			if (levels.length > 0) {
				$("#approve-levels").slideDown();
				levels.forEach(function (lvl) {
					$('#approve-levels input[type="checkbox"][value="' + lvl + '"]').prop(
						"checked",
						true
					);
				});
			} else {
				$("#approve-levels").slideUp();
			}
		});

		// === Tampilkan modal ===
		$("#aksesModal").modal("show");
	});

	// ✅ Tambahan: Submit Form Akses
	$("#aksesForm").on("submit", function (e) {
		e.preventDefault();

		// Cek apakah approve dicentang
		let approveChecked = $("input.akses-checkbox[data-id='5']").is(":checked");
		let approveLevelsChecked = $("#approve-levels input:checked").length;

		if (approveChecked && approveLevelsChecked === 0) {
			Swal.fire({
				icon: "info",
				title: "Approve Aktif",
				text: "Silakan pilih level approve yang diinginkan",
				showConfirmButton: true,
				timer: 2000,
			});
			return;
		}

		var formData = $(this).serialize();

		$.ajax({
			url: BASE_URL + "Role/simpan_akses",
			type: "POST",
			data: formData,
			dataType: "json", // ✅ ini penting biar langsung JSON
			success: function (res) {
				if (res.status === "success") {
					$("#aksesModal").modal("hide");
					Swal.fire({
						icon: "success",
						title: "Berhasil",
						text: res.message,
						showConfirmButton: false,
						timer: 2000,
					});
					tableRole();
				} else if (res.status === "error_approve_level") {
					Swal.fire({
						icon: "warning",
						title: "Approve Nonaktif",
						text: res.message,
						showConfirmButton: false,
						timer: 2000,
					});
				} else {
					Swal.fire(
						"Gagal!",
						"Server mengembalikan respon tidak valid.",
						"error"
					);
				}
			},
			error: function () {
				Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan akses.", "error");
			},
		});
	});

	// Saat checkbox selain ALL diubah
	$('#aksesForm input[type="checkbox"]')
		.not("#aksesAll")
		.on("change", function () {
			var total = $('#aksesForm input[type="checkbox"]').not(
				"#aksesAll"
			).length;
			var checked = $('#aksesForm input[type="checkbox"]:checked').not(
				"#aksesAll"
			).length;
			$("#aksesAll").prop("checked", total === checked);
		});

	// $('#aksesAll').on('change', function () {
	//     var isChecked = $(this).is(':checked');
	//     // Cek atau uncek semua checkbox kecuali 'aksesAll'
	//     $('#aksesForm input[type="checkbox"]').not('#aksesAll').prop('checked', isChecked);
	// });

	// approve level
	$(document).on("change", ".akses-checkbox", function () {
		let id = $(this).data("id");

		if (id == 5) {
			// Approve
			if ($(this).is(":checked")) {
				$("#approve-levels").slideDown();
			} else {
				$("#approve-levels").slideUp();
				$("#approve-levels input").prop("checked", false); // reset kalau di-uncheck
			}
		}
	});

	// ALL check/uncheck semua
	$("#aksesAll").on("change", function () {
		let checked = $(this).is(":checked");
		$(".akses-checkbox").prop("checked", checked).trigger("change");
	});
});

function tableRole() {
	$.ajax({
		url: BASE_URL + "Role/tableRole",
		type: "POST",
		success: function (data) {
			$("#div-table-role").html(data);
			$("#tableRole").DataTable({
				processing: true,
				responsive: true,
			});
		},
	});
}
