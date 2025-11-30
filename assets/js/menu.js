$(document).ready(function () {
	tableMenu();
	$("#id").val("");
	$("#menuForm").trigger("reset");

	$("#modul").select2({
		theme: "bootstrap4",
		allowClear: true,
		width: "100%",
	});

	$("#save-data").click(function (e) {
		e.preventDefault();

		$.ajax({
			data: $("#menuForm").serialize(),
			url: BASE_URL + "Menu/store",
			type: "POST",
			datatype: "json",
			success: function (data) {
				$("#menuForm").trigger("reset");
				$("#modul").val(null).trigger("change");
				Swal.fire({
					title: "Good job!",
					text: "Data Berhasil disimpan!",
					icon: "success",
					timer: 1500,
					showConfirmButton: false,
				});
				tableMenu();
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
			url: BASE_URL + "Menu/vedit/" + id,
			type: "GET",
			dataType: "json",
			success: function (data) {
				// console.log(data);
				$("#id").val(id);
				$("#nama_menu").val(data.name);
				$("#url_menu").val(data.url);
				$("#modul").val(data.modul_id).trigger("change");
			},
		});
		$("#cancel-edit").show();
	});

	$("#cancel-edit").on("click", function () {
		// Reset form
		$("#menuForm")[0].reset();
		$("#modul").val(null).trigger("change");

		// Sembunyikan tombol cancel
		$(this).hide();
	});

	$("body").on("click", ".delete", function (e) {
		e.preventDefault();
		var id = $(this).data("id");

		swal({
			title: "Are you sure?",
			text: "You won't be able to revert this!",
			type: "warning",
			buttons: {
				cancel: {
					visible: true,
					text: "No, cancel!",
					className: "btn btn-danger",
				},
				confirm: {
					text: "Yes, delete it!",
					className: "btn btn-success",
				},
			},
		}).then((result) => {
			if (result) {
				// Ini boolean true/false
				console.log("Deleting ID:", id);
				$.ajax({
					url: BASE_URL + "Menu/delete/" + id,
					method: "POST",
					success: function (res) {
						swal("Good job!", "Data Berhasil dihapus!", {
							icon: "success",
							buttons: false,
							timer: 1500,
						});
						tableMenu();
					},
					error: function () {
						swal("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
					},
				});
			}
		});
	});

	$("body").on("click", ".addSub", function () {
		let id = $(this).data("id");
		let name = $(this).data("name");

		// Reset form
		$("#menuForm")[0].reset();
		$("#id").val("");

		// Set nama dan id menu utama
		$("#nama_menu_utama").val(name);
		$("#menu_id").val(id);

		// Tampilkan modal
		$("#subMenuModal").modal("show");
	});

	// Handle klik tombol dataSub dan tampilkan modal dengan data
	$(document).on("click", ".dataSub", function () {
		const menuId = $(this).data("id");
		const namaMenu = $(this).data("nama");

		// Set data ke modal
		$("#modalSubMenu").data("menu-id", menuId);
		$("#namaMenuUtamaText").text(namaMenu);

		// Kosongkan table dulu
		$("#subMenuTable tbody").empty();

		// Tampilkan modal
		$("#modalSubMenu").modal("show");

		// Ambil data sub menu dari server
		$.ajax({
			url: BASE_URL + "Menu/getSubMenuByMenuId",
			type: "GET",
			data: { menu_id: menuId },
			dataType: "json",
			success: function (data) {
				if (data.length > 0) {
					data.forEach((item) => {
						$("#subMenuTable tbody").append(`
                            <tr>
                                <td contenteditable="true">${item.name}</td>
                                <td contenteditable="true">${item.url_sub}</td>
                                <td>
                                    <button class="btn btn-success btn-sm saveRow"><i class="fa fa-save"></i></button>
                                    <button class="btn btn-danger btn-sm deleteRow"><i class="fa fa-trash"></i></button>
                                </td>
                            </tr>
                        `);
					});
				}
			},
			error: function (xhr) {
				console.error("Gagal mengambil data:", xhr.responseText);
			},
		});
	});

	$(document).on("click", "#addRow", function () {
		$("#subMenuTable tbody").append(`
            <tr>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td>
                    <button class="btn btn-success btn-sm saveRow"><i class="fa fa-save"></i></button>
                    <button class="btn btn-danger btn-sm deleteRow"><i class="fa fa-trash"></i></button>
                </td>
            </tr>
        `);
	});

	$(document).on("click", ".saveRow", function () {
		const row = $(this).closest("tr");
		const nama = row.find("td:eq(0)").text().trim();
		const url = row.find("td:eq(1)").text().trim();
		const menuId = $("#modalSubMenu").data("menu-id");
		const subMenuId = row.data("submenu-id") || null; // Ambil ID kalau ada

		if (!nama || !url) {
			alert("Nama dan URL tidak boleh kosong!");
			return;
		}

		$.ajax({
			url: BASE_URL + "Menu/simpanSubMenu",
			type: "POST",
			data: {
				id: subMenuId, // Kirim ID jika ada (untuk update)
				name: nama,
				url_sub: url,
				menu_id: menuId,
			},
			success: function (res) {
				const result = JSON.parse(res);

				if (result.status === "inserted") {
					// Simpan ID ke row
					row.data("submenu-id", result.id);

					// Ganti tombol menjadi Edit
					row
						.find(".saveRow")
						.removeClass("saveRow btn-success")
						.addClass("editRow btn-warning")
						.html('<i class="fa fa-edit"></i>');
				} else if (result.status === "updated") {
					alert("Data berhasil diperbarui!");
				}
			},
			error: function (xhr) {
				alert("Terjadi kesalahan saat menyimpan!");
				console.error(xhr.responseText);
			},
		});
	});

	$(document).on("click", ".editRow", function () {
		// Sama saja, cukup panggil ulang .saveRow karena dia sudah tahu itu update
		$(this)
			.removeClass("editRow btn-warning")
			.addClass("saveRow btn-success")
			.html('<i class="fa fa-save"></i>');
	});

	// delete data

	// $(document).on('click', '.saveRow', function () {
	//     const row = $(this).closest('tr');
	//     const nama = row.find('td:eq(0)').text().trim();
	//     const url = row.find('td:eq(1)').text().trim();
	//     const menu = $('#modalSubMenu').data('menu-id'); // Ambil menu_id dari modal

	//     // Validasi sederhana
	//     if (!nama || !url) {
	//         alert('Nama dan URL tidak boleh kosong!');
	//         return;
	//     }

	//     $.ajax({
	//         url: BASE_URL + 'Menu/simpanSubMenu',
	//         type: 'POST',
	//         data: {
	//             name: nama,
	//             url_sub: url,
	//             menu_id: menu
	//         },
	//         success: function (res) {
	//             alert('Data berhasil disimpan!');
	//             console.log(res);

	//             row.data('submenu-id', res.id);

	//             // Ubah tombol Save menjadi Edit
	//             row.find('.saveRow')
	//                 .removeClass('saveRow btn-success')
	//                 .addClass('editRow btn-warning')
	//                 .html('<i class="fa fa-edit"></i>');
	//         },
	//         error: function (xhr) {
	//             alert('Gagal menyimpan data!');
	//             console.error(xhr.responseText);
	//         }
	//     });
	// });

	// $(document).on('click', '.editRow', function () {
	//     const row = $(this).closest('tr');
	//     const nama = row.find('td:eq(0)').text().trim();
	//     const url = row.find('td:eq(1)').text().trim();
	//     const submenuId = row.data('submenu-id');

	//     if (!nama || !url) {
	//         alert('Nama dan URL tidak boleh kosong!');
	//         return;
	//     }

	//     $.ajax({
	//         url: BASE_URL + 'Menu/updateSubMenu',
	//         type: 'POST',
	//         data: {
	//             id: submenuId,
	//             name: nama,
	//             url_sub: url
	//         },
	//         success: function () {
	//             alert('Data berhasil diperbarui!');
	//         },
	//         error: function (xhr) {
	//             alert('Gagal memperbarui data!');
	//             console.error(xhr.responseText);
	//         }
	//     });
	// });

	$("#submenuForm").on("submit", function (e) {
		e.preventDefault();
		$.ajax({
			url: BASE_URL + "Menu/storesubMenu", // ganti dengan nama controller kamu
			method: "POST",
			data: $(this).serialize(),
			dataType: "json",
			success: function (response) {
				$("#subMenuModal").modal("hide");
				swal("Good job!", "Data SubMenu Berhasil disimpan!", {
					icon: "success",
					buttons: false,
					timer: 1500,
				});
				// tableMenu();
				// bisa juga reload datatable atau bagian tertentu
			},
			error: function () {
				alert("Terjadi kesalahan saat menyimpan data.");
			},
		});
	});

	$(document).on("click", ".dataSub", function () {
		let menu_id = $(this).data("id");
		let menu_name = $(this).data("name");

		$("#judul-submenu").text(menu_name);
		$("#listSubMenu").html('<tr><td colspan="3">Loading...</td></tr>');

		$.ajax({
			url: BASE_URL + "Menu/getSubMenuByMenuId",
			method: "POST",
			data: { menu_id: menu_id },
			dataType: "json",
			success: function (res) {
				let html = "";
				if (res.length > 0) {
					$.each(res, function (i, item) {
						html += `
                            <tr>
                                <td>${i + 1}</td>
                                <td>${item.name}</td>
                                <td>${item.url_sub}</td>
                                <td>
                                    <button class="btn btn-sm btn-warning btn-edit-sub" 
                                            data-id="${item.id}" 
                                            data-name="${item.name}" 
                                            data-url="${item.url_sub}" 
                                            data-menu="${item.menu_id}"
                                            data-menu_name="${item.menu_name}">
                                        <i class="fa fa-edit"></i>
                                    </button>
                                    <button class="btn btn-sm btn-danger btn-delete-sub" 
                                            data-id="${item.id}">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </td>
                            </tr>`;
					});
				} else {
					html = `<tr><td colspan="4">Tidak ada data.</td></tr>`;
				}
				$("#listSubMenu").html(html);
			},
			error: function () {
				$("#listSubMenu").html(
					'<tr><td colspan="3">Gagal mengambil data.</td></tr>'
				);
			},
		});

		$("#modalDataSubMenu").modal("show");
	});

	$(document).on("click", ".btn-edit-sub", function () {
		var id = $(this).data("id") || "";
		var name = $(this).data("name") || "";
		var url = $(this).data("url") || "";
		var menu = $(this).data("menu") || "";
		var menuName = $(this).data("menu_name") || "";

		console.log(
			"ID:",
			id,
			"Name:",
			name,
			"URL:",
			url,
			"Menu ID:",
			menu,
			"Menu Name:",
			menuName
		);

		// Tutup modal lama dulu
		$("#modalDataSubMenu").modal("hide");

		// Isi data ke input
		$("#id").val(id);
		$("#nama_sub_menu").val(name);
		$("#url_sub_menu").val(url);
		$("#menu_id").val(menu);
		$("#nama_menu_utama").val(menuName);

		// Tampilkan modal edit
		$("#editsubMenuModal").modal("show");
	});
});

function tableMenu() {
	$.ajax({
		url: BASE_URL + "Menu/tableMenu",
		type: "POST",
		success: function (data) {
			$("#div-table-menu").html(data);
			$("#tableMenu").DataTable({
				processing: true,
				responsive: true,
			});
		},
	});
}
