<table id="tableRole" class="display table table-striped table-hover">
    <thead>
        <tr>
            <th>No</th>
            <th>Nama Role</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php
        $x=1;
        foreach ($role as $row) { ?>
            <tr>
                <th><?= $x++; ?></th>
                <th><?= $row->nama_role ?></th>
                <th>
                    <button type="button" class="btn btn-success btn-sm akses" title="akses role" data-id=<?= $row->id ?> data-toggle="modal" data-target="#aksesModal"><i class="fa fa-key"></i></button>
                    <button type="button" class="btn btn-warning btn-sm edit" title="edit role" data-id=<?= $row->id ?>><i class="fa fa-edit"></i></button>
                </th>
            </tr>
        <?php }
        ?>
    </tbody>
</table>