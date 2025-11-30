<table id="tableUser" class="display table table-striped table-hover">
    <thead>
        <tr>
            <th>Name</th>
            <th>Nama User</th>
            <th>Bagian</th>
            <th>Username</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        <?php 
        $x=1;
        foreach ($user as $row) {?>
            <tr>
                <td><?= $x++; ?></td>
                <td><?= $row->name ?></td>
                <td><?= $row->bagian ?></td>
                <td><?= $row->username ?></td>
                <td><?= $row->status ?></td>
                <td>
                    <a href="<?= site_url('User/user_akses/'.$row->id) ?>" class="btn btn-success btn-sm"><i class="fa fa-key"></i></a>
                    <button type="button" class="btn btn-warning btn-sm edit" data-id='<?= $row->id ?>'><i class="fa fa-edit"></i></button>
                </td>
            </tr>
        <?php }
        ?>
    </tbody>
</table>