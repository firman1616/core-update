$(document).ready(function () {
	tableUser();
	// tableUserAkses();
	$("#id").val("");
	$("#userForm").trigger("reset");

	$("#bagian").select2({
		theme: "bootstrap4",
		allowClear: true,
		width: "100%",
	});

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#userForm").serialize(),
			url: BASE_URL + "User/store",
			type: "POST",
			datatype: "json",
			success: function (data) {
				$("#userForm").trigger("reset");
				$("#bagian").val(null).trigger("change");
				swal.fire("Good job!", "Data Berhasil disimpan!", {
					icon: "success",
					buttons: false,
					timer: 1500,
				});
				tableUser();
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
			url: BASE_URL + "User/vedit/" + id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				console.log(data);
				$("#id").val(id);
				$("#nik").val(data.nik);
				$("#nama_user").val(data.name);
				$("#username").val(data.username);
				$("#password").val(data.password);
				$("#bagian").val(data.bagian).trigger("change");
			},
		});
		$("#cancel-edit").show();
	});

	$("#showPassword").on("change", function () {
		var passwordInput = $("#password");
		var type = $(this).is(":checked") ? "text" : "password";
		passwordInput.attr("type", type);
	});

	// save role akses user
	$("#formAkses").submit(function (e) {
		e.preventDefault(); // mencegah reload

		var formData = $(this).serialize();
		const userId = $(this).data("user-id");

		$.ajax({
			url: BASE_URL + "User/update_akses/" + userId,
			type: "POST",
			data: formData,
			success: function (response) {
				Swal.fire({
					icon: "success",
					title: "Akses Menu / Modul Berhasil Disimpan",
					text: response.message,
					showConfirmButton: false,
					timer: 1500,
				});
				setTimeout(() => {
					window.location.href = BASE_URL + "User";
				}, 1600);
			},
			error: function () {
				Swal.fire({
					icon: "error",
					title: "Terjadi Kesalahan Ketika Menyimpan !",
					text: res.message,
					showConfirmButton: false, // sembunyikan tombol OK
					timer: 1500, // 2 detik lalu otomatis close
				});
			},
		});
	});

	$("#cancel-edit").on("click", function () {
		// Reset form
		$("#menuForm")[0].reset();
		$("#modul").val(null).trigger("change");

		// Sembunyikan tombol cancel
		$(this).hide();
	});
});

function tableUser() {
	$.ajax({
		url: BASE_URL + "User/tableUser",
		type: "POST",
		success: function (data) {
			$("#div-table-user").html(data);
			$("#tableUser").DataTable({
				processing: true,
				responsive: true,
			});
		},
	});
}
