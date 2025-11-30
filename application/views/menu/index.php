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
                        <form action="" id="menuForm" name="menuForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="id" id="id">
                            <div class="form-group">
                                <label for="username">Nama Menu</label>
                                <input type="text" class="form-control" id="nama_menu" name="nama_menu" placeholder="Sales">
                            </div>
                            <div class="form-group">
                                <label for="username">URL Menu</label>
                                <input type="text" class="form-control" id="url_menu" name="url_menu" placeholder="Controller/method">
                            </div>
                            <div class="form-group">
                                <label for="username">Modul</label>
                                <select name="modul" id="modul" class="form-control">
                                    <option value="" disabled selected>Pilih Modul</option>
                                    <?php
                                    foreach ($modul as $row) { ?>
                                        <option value="<?= $row->id ?>"><?= $row->name ?></option>
                                    <?php }
                                    ?>
                                </select>
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
                        <h4 class="card-title">Table Menu</h4>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <div id="div-table-menu"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- add sub menu -->
<!-- Modal -->
<div class="modal fade" id="subMenuModal" tabindex="-1" role="dialog" aria-labelledby="subMenuModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form action="" id="submenuForm" name="submenuForm" method="POST" enctype="multipart/form-data">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="subMenuModalLabel">Tambah Sub Menu</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="id" name="id">

                    <div class="form-group">
                        <label for="nama_menu">Nama Sub Menu</label>
                        <input type="text" class="form-control" id="nama_sub_menu" name="nama_sub_menu" required>
                    </div>

                    <div class="form-group">
                        <label for="url_menu">URL Sub Menu</label>
                        <input type="text" class="form-control" id="url_sub_menu" name="url_sub_menu" required>
                    </div>

                    <div class="form-group">
                        <label for="modul">Menu</label>
                        <input type="text" class="form-control" id="nama_menu_utama" disabled>
                        <input type="hidden" name="menu_id" id="menu_id">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel-edit">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="simpan-sub">Save</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- modal edit -->
<div class="modal fade" id="editsubMenuModal" tabindex="-1" role="dialog" aria-labelledby="subMenuModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <form action="" id="editsubmenuForm" name="editsubmenuForm" method="POST" enctype="multipart/form-data">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="subMenuModalLabel">Edit Sub Menu</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="id" name="id">

                    <div class="form-group">
                        <label for="nama_menu">Nama Sub Menu</label>
                        <input type="text" class="form-control" id="nama_sub_menu" name="nama_sub_menu" required>
                    </div>

                    <div class="form-group">
                        <label for="url_menu">URL Sub Menu</label>
                        <input type="text" class="form-control" id="url_sub_menu" name="url_sub_menu" required>
                    </div>

                    <div class="form-group">
                        <label for="modul">Menu</label>
                        <input type="text" class="form-control" id="nama_menu_utama" disabled>
                        <input type="hidden" name="menu_id" id="menu_id">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" id="cancel-edit">Cancel</button>
                    <button type="submit" class="btn btn-primary" id="simpan-sub">Save</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Data Submenu -->
<div class="modal fade" id="modalDataSubMenu" tabindex="-1" role="dialog" aria-labelledby="modalDataSubMenuLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalDataSubMenuLabel">Data Sub Menu: <span id="judul-submenu"></span></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="table-responsive">
                    <table class="table table-bordered" id="tabelSubMenu">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Sub Menu</th>
                                <th>URL</th>
                                <th>Aksi</th> 
                            </tr>
                        </thead>
                        <tbody id="listSubMenu">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>