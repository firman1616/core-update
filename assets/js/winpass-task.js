$(document).ready(function() {
    // Load table task saat halaman dibuka
    loadTaskTable();

    // Tombol refresh
    $('#btn-refresh-task').click(loadTaskTable);

    // Fungsi load table task
    function loadTaskTable() {
        $.get(BASE_URL + 'winpass/tableTask', function(res) {
            const data = JSON.parse(res);
            $('#tableTaskContainer').html(data.html);

            // Inisialisasi DataTables
            $('#tableTaskContainer table').DataTable({
                destroy: true,
                paging: true,
                searching: true,
                ordering: true,
                order: [[7, 'desc']], // kolom created_at
                lengthMenu: [10, 25, 50, 100],
                language: {
                    search: "Cari:",
                    lengthMenu: "Tampilkan _MENU_ entries",
                    info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                    paginate: { previous: "Sebelumnya", next: "Berikutnya" },
                    zeroRecords: "Data tidak ditemukan"
                }
            });
        });
    }

    // Retry task
    $(document).on('click', '.btn-retry', function() {
        const id = $(this).data('id');
        if (confirm('Yakin ingin menjalankan ulang task ini?')) {
            $.post(BASE_URL + 'winpass/retry_task', { id }, function(res) {
                alert(res.message);
                loadTaskTable();
            }, 'json');
        }
    });

    // Delete task
    $(document).on('click', '.btn-delete', function() {
        const id = $(this).data('id');
        if (confirm('Yakin ingin menghapus task ini?')) {
            $.post(BASE_URL + 'winpass/delete_task', { id }, function(res) {
                alert(res.message);
                loadTaskTable();
            }, 'json');
        }
    });
});
