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
                        <form action="" id="bagianForm" name="bagianForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="id" id="id">
                            <div class="form-group">
                                <label for="username">Kode Bagian</label>
                                <input type="text" class="form-control" id="kode_bagian" name="kode_bagian" placeholder="MKT">
                            </div>
                            <div class="form-group">
                                <label for="username">Nama Bagian</label>
                                <input type="text" class="form-control" id="nama_bagian" name="nama_bagian" placeholder="Marketing">
                            </div>

                            <?php if (cek_menu_akses(1, 1, 1)): ?>
                                <button type="submit" class="btn btn-primary" id="save-data">
                                    <span class="btn-label">
                                        <i class="fa fa-save"></i>
                                    </span>
                                    Simpan Data
                                </button>
                            <?php endif; ?>
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
                        <h4 class="card-title">Table Bagian</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <div id="div-table-bagian"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>