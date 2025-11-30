<table id="tableBagian" class="display table table-striped table-hover">
    <thead>
        <tr>
            <th>No</th>
            <th>Kode Bagian</th>
            <th>Nama Bagian</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php 
        $x=1;
        foreach ($bagian as $row) { ?>
        <tr>
            <td><?= $x++; ?></td>
            <td><?= $row->kode_bagian ?></td>
            <td><?= $row->nama_bagian ?></td>
            <td>
                <button type="button" class="btn btn-warning btn-sm edit" data-id="<?= $row->id ?>" title="Edit Bagian"><i class="fa fa-edit"></i></button>
            </td>
        </tr>
        <?php }
        ?>
    </tbody>
</table>