$(document).ready(function(){
    loadLogTable();
    $('#btn-refresh-log').click(loadLogTable);

    function loadLogTable(){
        $.get(BASE_URL + 'winpass/tableLog', function(res){
            const data = JSON.parse(res);
            $('#tableLogContainer').html(data.html);

            $('#tableLogContainer table').DataTable({
                destroy: true,
                paging: true,
                searching: true,
                ordering: true,
                order: [[5,'desc']],
                lengthMenu: [10,25,50,100],
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
});
