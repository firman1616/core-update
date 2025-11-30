$(document).ready(function () {
    tableContainer();
    $('#id').val('');
    $('#containerForm').trigger("reset");

    $('#save-data').click(function (e) {
        e.preventDefault();

        $.ajax({
            data: $('#containerForm').serialize(),
            url: BASE_URL + "Container/store",
            type: "POST",
            datatype: 'json',
            success: function (data) {
                $('#containerForm').trigger("reset");

                // Tutup modal setelah simpan
                $('#modalTambahData').modal('hide');

                swal("Good job!", "Data Berhasil disimpan!", {
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                tableContainer();
            },
            error: function (data) {
                console.log('Error:', data);
                $('#save-data').html('Simpan Data');
            }
        });
    })

    $('#formEditData').submit(function (e) {
        e.preventDefault();

        $.ajax({
            data: $('#formEditData').serialize(),
            url: BASE_URL + "Item/store",
            type: "POST",
            dataType: 'json',
            success: function (data) {
                $('#formEditData').trigger("reset");
                $('#modalEditData').modal('hide');
                swal("Good job!", "Data berhasil diperbarui!", {
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                tableContainer(); // reload datatable
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    $('#cancel-edit').on('click', function () {
        // Reset form
        $('#itemForm')[0].reset();

        // Sembunyikan tombol cancel
        $(this).hide();
    });

    $(document).on('click', '#TambahData', function () {
        $('#modalTambahData').modal('show');

        $('.select2').each(function () {
            if ($(this).hasClass("select2-hidden-accessible")) {
                $(this).select2('destroy');
            }
            $(this).select2({
                placeholder: "Pilih opsi",
                allowClear: true,
                width: '100%',
            });
        });
    });

    $(document).on('click', '.edit', function () {
        var id = $(this).data('id');

        // $('#modalEditData').modal('show');

        $.ajax({
            url: BASE_URL + "Container/get_data/" + id, // Ganti "controller" dengan nama controller-mu
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#modalEditData').modal('show');
                $('#id').val(data.id);
                $('#edit-container_type').val(data.name);
                $('#edit-i_panjang').val(data.in_length.replace(',', '.'));
                $('#edit-i_lebar').val(data.in_width.replace(',', '.'));
                $('#edit-i_tinggi').val(data.in_height.replace(',', '.'));
                $('#edit-volume').val(data.volume.replace(',', '.'));
                $('#edit-d_lebar').val(data.d_with.replace(',', '.'));
                $('#edit-d_tinggi').val(data.d_height.replace(',', '.'));
                $('#edit-tare').val(data.tare_weight.replace(',', '.'));
                $('#edit-gross').val(data.max_gros_weight.replace(',', '.'));
                $('#edit-max_payload').val(data.max_payload.replace(',', '.'));
            },
            error: function () {
                alert('Gagal mengambil data.');
            }
        });
    });

    $('#formEditData').submit(function (e) {
        e.preventDefault();

        $.ajax({
            data: $('#formEditData').serialize(),
            url: BASE_URL + "Container/store",
            type: "POST",
            dataType: 'json',
            success: function (data) {
                $('#formEditData').trigger("reset");
                $('#modalEditData').modal('hide');
                swal("Good job!", "Data berhasil diperbarui!", {
                    icon: "success",
                    buttons: false,
                    timer: 1500,
                });
                tableContainer(); // reload datatable
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    });

    // import modal
    $(document).on('click', '#ImportData', function () {
        $('#modalImportData').modal('show');
    });

    $('#formImportData').on('submit', function (e) {
        e.preventDefault();

        let formData = new FormData(this);

        // Munculkan alert loading sebelum upload dimulai
        swal({
            title: 'Mohon tunggu...',
            text: 'Sedang mengupload dan memproses file',
            icon: 'info',
            buttons: false,
            closeOnClickOutside: false,
            closeOnEsc: false
        });

        $.ajax({
            url: BASE_URL + "Item/import_excel",
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                try {
                    let res = typeof response === 'string' ? JSON.parse(response) : response;

                    if (res.status === 'success') {
                        $('#modalImportData').modal('hide'); // Tutup modal

                        swal({
                            title: 'Berhasil',
                            text: res.message.replace(/<br>/g, "\n"),
                            icon: 'success',
                            timer: 3000,
                            buttons: false
                        });
                        tableContainer();

                    } else {
                        swal({
                            title: 'Gagal',
                            text: res.message.replace(/<br>/g, "\n"),
                            icon: 'error',
                            button: 'Tutup'
                        });
                    }
                } catch (e) {
                    console.error("Gagal parsing response:", e);
                    swal("Error", "Terjadi kesalahan saat memproses respon", "error");
                }
            },
            error: function (xhr) {
                console.error(xhr.responseText);
                swal("Error", "Terjadi kesalahan pada server", "error");
            }
        });
    });

    function hitungVolume() {
        let p = parseFloat($('#i_panjang').val()) || 0;
        let l = parseFloat($('#i_lebar').val()) || 0;
        let t = parseFloat($('#i_tinggi').val()) || 0;

        let volume = p * l * t;

        // let formattedVolume = volume.toLocaleString('id-ID', {
        //     minimumFractionDigits: 3,
        //     maximumFractionDigits: 3
        // });
        $('#volume').val(volume);
    }

    // Jalankan saat user mengetik di salah satu field dimensi
    $('#i_panjang, #i_lebar, #i_tinggi').on('input', function () {
        hitungVolume();
    });

    function hitungVolumeEdit() {
        let p = parseFloat($('#edit-i_panjang').val()) || 0;
        let l = parseFloat($('#edit-i_lebar').val()) || 0;
        let t = parseFloat($('#edit-i_tinggi').val()) || 0;

        let volume = p * l * t;

        // let formattedVolume = volume.toLocaleString('id-ID', {
        //     minimumFractionDigits: 3,
        //     maximumFractionDigits: 3
        // });
        $('#edit-volume').val(volume);
    }

    // Jalankan saat user mengetik di salah satu field dimensi
    $('#edit-i_panjang, #edit-i_lebar, #edit-i_tinggi').on('input', function () {
        hitungVolumeEdit();
    });

    function hitungPayload() {
        let max_gross = parseFloat($('#gross').val()) || 0;
        let tare = parseFloat($('#tare').val()) || 0;

        let payload = max_gross - tare;

        // let formattedpayload = payload.toLocaleString('id-ID', {
        //     minimumFractionDigits: 3,
        //     maximumFractionDigits: 3
        // });
        $('#max_payload').val(payload);
    }

    // Jalankan saat user mengetik di salah satu field dimensi
    $('#gross, #tare').on('input', function () {
        hitungPayload();
    });

    function hitungPayloadEdit() {
        let edit_max_gross = parseFloat($('#edit-gross').val()) || 0;
        let edit_tare = parseFloat($('#edit-tare').val()) || 0;

        let edit_payload = edit_max_gross - edit_tare;

        // let formattedVolume = volume.toLocaleString('id-ID', {
        //     minimumFractionDigits: 3,
        //     maximumFractionDigits: 3
        // });
        $('#edit-max_payload').val(edit_payload);
    }

    // Jalankan saat user mengetik di salah satu field dimensi
    $('#edit-gross, #edit-tare').on('input', function () {
        hitungPayloadEdit();
    });


});

function tableContainer() {
    $.ajax({
        url: BASE_URL + "container/tableContainer",
        type: "POST",
        success: function (data) {
            $('#div-table-container').html(data);

            $('#tableContainer').DataTable({
                processing: true,
                responsive: true,
                dom:
                    "<'row'<'col-md-6'f><'col-md-6 d-flex justify-content-end align-items-start'<'btn-group-custom'>>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-md-4'l><'col-md-4 text-center'i><'col-md-4'p>>"
            });

            let buttonHTML = '';

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

            $('.btn-group-custom').html(buttonHTML);

            setTimeout(function () {
                $('.dataTables_filter').css({
                    'float': 'left',
                    'text-align': 'left'
                });
                $('.dataTables_length').css({
                    'float': 'left',
                    'text-align': 'left'
                });
                $('.dataTables_info').css({
                    'text-align': 'center',
                    'float': 'none',
                    'margin': '0 auto',
                    'display': 'block'
                });
            }, 10);
        }
    });
}



