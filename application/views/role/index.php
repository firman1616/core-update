<div class="content">
    <div class="page-inner">
        <div class="page-header">
            <h4 class="page-title"><?= $title ?></h4>

        </div>

        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Form</h4>
                    </div>
                    <div class="card-body">
                        <form action="" id="roleForm" name="roleForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="id" id="id">
                            <div class="form-group">
                                <label for="username">Nama Role</label>
                                <input type="text" class="form-control" id="nama_role" name="nama_role" placeholder="Role">
                            </div>
                            <button type="submit" class="btn btn-primary" id="save-data">
                                <span class="btn-label">
                                    <i class="fa fa-save"></i>
                                </span>
                                Simpan Data
                            </button>
                            <button type="button" class="btn btn-danger" id="cancel-edit" style="display: none;">
                                <i class="fa fa-times"></i> Cancel
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">Table Role</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <div id="div-table-role"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- modal akses -->
<!-- Modal -->
<div class="modal fade" id="aksesModal" tabindex="-1" role="dialog" aria-labelledby="aksesModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form id="aksesForm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="aksesModalLabel">Akses Role</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Tutup">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="role_id" name="role_id">

                    <!-- Checkbox ALL -->
                    <div class="form-check">
                        <label class="form-check-label">
                            <input class="form-check-input" type="checkbox" value="" id="aksesAll">
                            <span class="form-check-sign">ALL</span>
                        </label>
                    </div>

                    <!-- Loop semua akses -->
                    <?php foreach ($get_akses as $row) { ?>
                        <div class="form-check ml-2">
                            <label class="form-check-label">
                                <input
                                    class="form-check-input akses-checkbox"
                                    type="checkbox"
                                    name="akses[]"
                                    value="<?= $row->id ?>"
                                    data-id="<?= $row->id ?>">
                                <span class="form-check-sign"><?= $row->name ?></span>
                            </label>
                        </div>
                    <?php } ?>

                    <!-- Approve Levels (diletakkan hanya 1x di luar foreach) -->
                    <div class="ml-4 mt-2" id="approve-levels" style="display:none;">
                        <?php for ($i = 1; $i <= 5; $i++) { ?>
                            <div class="form-check">
                                <label class="form-check-label">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="approve_level[]"
                                        value="<?= $i ?>">
                                    <span class="form-check-sign">Approve Lv <?= $i ?></span>
                                </label>
                            </div>
                        <?php } ?>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">Simpan</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Tutup</button>
                </div>
            </div>
        </form>
    </div>
</div>