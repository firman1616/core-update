$(document).ready(function () {
    loadTable();

    // Refresh table
    $('#btn-refresh').click(loadTable);

    // Tambah user
    $('#formTambahUser').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: BASE_URL + 'winpass/save_user',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (res) {
                alert(res.message);
                if (res.success) {
                    $('#modalTambahUser').modal('hide');
                    loadTable();
                }
            },
            error: function () {
                alert('Gagal menambahkan user.');
            }
        });
    });

     // Reset Password
    $(document).on('click', '.btn-reset', function() {
        const id = $(this).data('id');
        $('#reset_user_id_modal').val(id);
        $('#modalResetPassword').modal('show');
    });

    // Form submit dengan delegation
    $(document).on('submit', '#formResetPasswordModal', function(e) {
        e.preventDefault();

        // Cek data yang dikirim
        console.log($(this).serialize()); 

        $.ajax({
            url: BASE_URL + 'winpass/reset_password',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(res) {

                if (res.success) {
                    // Tutup modal
                    $('#modalResetPassword').modal('hide');

                    // Reload table setelah modal hide, beri delay kecil agar tidak freeze
                    setTimeout(function() {
                        loadTable();
                    }, 50);
                }

                // Tampilkan alert
                alert(res.message || 'Password berhasil direset');
            },
            error: function(xhr, status, error) {
                alert('Gagal reset password: ' + error + ' (HTTP ' + xhr.status + ')');
            }
        });
    });



    // Enable user
    $(document).on('click', '.btn-enable', function () {
        const id = $(this).data('id');
        $.ajax({
            url: BASE_URL + 'winpass/enable_user',
            type: 'POST',
            data: { id },
            dataType: 'json',
            success: function (res) {
                alert(res.message);
                loadTable();
            },
            error: function () {
                alert('Gagal mengaktifkan user.');
            }
        });
    });

    // Disable user
    $(document).on('click', '.btn-disable', function () {
        const id = $(this).data('id');
        $.ajax({
            url: BASE_URL + 'winpass/disable_user',
            type: 'POST',
            data: { id },
            dataType: 'json',
            success: function (res) {
                alert(res.message);
                loadTable();
            },
            error: function () {
                alert('Gagal menonaktifkan user.');
            }
        });
    });

    // Unlock user
    $(document).on('click', '.btn-unlock', function () {
        const id = $(this).data('id');
        $.ajax({
            url: BASE_URL + 'winpass/unlock_user',
            type: 'POST',
            data: { id },
            dataType: 'json',
            success: function (res) {
                alert(res.message);
                loadTable();
            },
            error: function () {
                alert('Gagal unlock user.');
            }
        });
    });

    // SET EXPIRY DATE → delegated event
    $(document).on('click', '.btn-set-expiry', function() {
        const id = $(this).data('id');
        $('#expiry_user_id_modal').val(id);
        $('#modalSetExpiry').modal('show');
    });

    // Form submit dengan delegation: Set Expiry
    $(document).on('submit', '#formSetExpiryModal', function(e) {
        e.preventDefault();

        // Cek data yang dikirim
        console.log($(this).serialize());

        $.ajax({
            url: BASE_URL + 'winpass/set_expiry', // pastikan endpoint sama seperti di controller
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function(res) {

                if (res.success) {
                    // Tutup modal
                    $('#modalSetExpiry').modal('hide');

                    // Reload table setelah modal hide, beri delay kecil agar tidak freeze
                    setTimeout(function() {
                        loadTable();
                    }, 50);
                }

                // Tampilkan alert
                alert(res.message || 'Tanggal kadaluarsa berhasil diupdate');
            },
            error: function(xhr, status, error) {
                alert('Gagal update expiry: ' + error + ' (HTTP ' + xhr.status + ')');
            }
        });
    });

});

// Tampilkan modal reset attempts
$(document).on('click', '.btn-reset-attempts', function() {
    const id = $(this).data('id');
    $('#reset_attempts_user_id_modal').val(id);
    $('#modalResetAttempts').modal('show');
});

// Submit reset attempts
$(document).on('submit', '#formResetAttemptsModal', function(e) {
    e.preventDefault();

    $.ajax({
        url: BASE_URL + 'winpass/reset_failed_attempts',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(res) {
            if (res.success) {
                    // Tutup modal
                    $('#modalResetAttempts').modal('hide');

                    // Reload table setelah modal hide, beri delay kecil agar tidak freeze
                    setTimeout(function() {
                        loadTable();
                    }, 50);
                }

                // Tampilkan alert
                alert(res.message || 'Password attempts berhasil dirubah');
        },
        error: function(xhr,status,error){
            alert('Gagal reset attempts: ' + error + ' (HTTP ' + xhr.status + ')');
        }
    });
});


// ===============================
// Fungsi Load Table + DataTable
// ===============================
function loadTable() {
    $.ajax({
        url: BASE_URL + "winpass/tableWinpass",
        type: "POST",
        success: function (data) {
            $('#div-table-winpass').html(data);

            $('#tableWinpass').DataTable({
                processing: true,
                responsive: true,
                destroy: true,
                dom:
                    "<'row'<'col-md-6'f><'col-md-6 d-flex justify-content-start align-items-start'<'btn-group-custom'>>>" +
                    "<'row'<'col-sm-12'tr>>" +
                    "<'row'<'col-md-4'l><'col-md-4 text-center'i><'col-md-4'p>>"
            });

            $('.btn-group-custom').html('');

            setTimeout(function () {
                $('.dataTables_filter').css({'float': 'left','text-align': 'left'});
                $('.dataTables_length').css({'float': 'left','text-align': 'left'});
                $('.dataTables_info').css({'text-align': 'center','float': 'none','margin': '0 auto','display': 'block'});
            }, 10);
        },
        error: function () {
            alert('Gagal memuat tabel user.');
        }
    });
}
