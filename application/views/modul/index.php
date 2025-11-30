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
                        <form action="" id="modulForm" name="modulForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="id" id="id">
                            <div class="form-group">
                                <label for="username">Nama Modul</label>
                                <input type="text" class="form-control" id="nama_modul" name="nama_modul" placeholder="Sales">
                            </div>
                            <div class="form-group">
                                <label for="username">URL Modul</label>
                                <input type="text" class="form-control" id="url_modul" name="url_modul" placeholder="Controller/method">
                            </div>
                            <div class="form-group">
                                <label for="username">Icon Modul</label>
                                <input type="text" class="form-control" id="icon_modul" name="icon_modul" placeholder="fas fa-icon">
                            </div>

                            <?php if (cek_menu_akses(1, 1, 1)): ?>
                                <button type="submit" class="btn btn-primary" id="save-data">
                                    <span class="btn-label">
                                        <i class="fa fa-save"></i>
                                    </span>
                                    Simpan Data
                                </button>
                            <?php endif; ?>

                            <?php if (cek_approve_level(1, 1, 1)): ?>
                                <button type="button" class="btn btn-success">
                                    <i class="fa fa-check"></i> Approve Level 1
                                </button>
                            <?php endif; ?>
                            <!-- <button type="submit" class="btn btn-primary" id="save-data">
                                <span class="btn-label">
                                    <i class="fa fa-save"></i>
                                </span>
                                Simpan Data
                            </button> -->
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
                        <h4 class="card-title">Table Modul</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <div id="div-table-modul"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>