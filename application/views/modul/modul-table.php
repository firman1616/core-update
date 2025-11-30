<table id="tableModul" class="display table table-striped table-hover">
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Modul</th>
            <th>URL</th>
            <th>Icon Modul</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php 
        $x=1;
        foreach ($modul as $row) { ?>
            <tr>
                <td><?= $x++; ?></td>
                <td><?= $row->name ?></td>
                <td><?= $row->url_modul ?></td>
                <td><?= $row->icon ?></td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm edit" data-id="<?= $row->id ?>"><i class="fa fa-edit"></i></button>
                </td>
            </tr>
        <?php }
        ?>
    </tbody>
</table>