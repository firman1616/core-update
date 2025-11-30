<table id="tableMenu" class="display table table-striped table-hover">
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Menu</th>
            <th>Url Menu</th>
            <th>Modul Parent</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $x = 1;
        foreach ($menu as $row) { ?>
            <tr>
                <td><?= $x++; ?></td>
                <td><?= $row->menu ?></td>
                <td><?= $row->url ?></td>
                <td><?= $row->modul ?></td>
                <td>
                    <button type="button" class="btn btn-warning btn-sm edit" data-id="<?= $row->id ?>"><i class="fa fa-edit"></i></button>
                    <button type="button" class="btn btn-danger btn-sm delete" data-id="<?= $row->id ?>"><i class="fa fa-trash"></i></button>
                </td>
            </tr>
        <?php }
        ?>
    </tbody>
</table>