<div class="content">
    <div class="page-inner">
        <div class="page-header">
            <h4 class="page-title"><?= $title ?></h4>

        </div>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title"><?= $kd_df ?></h3>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Tanggal Data Form</label>
                            <input type="date" class="form-control" id="tgl_df" name="tgl_df" value="<?= date('Y-m-d'); ?>">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Nama Sales</label>
                            <select name="sales" id="sales" class="form-control">
                                <option value="">Nama Sales</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Customer</label>
                            <select name="customer" id="customer" class="form-control">
                                <option value="">Customer</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Produk Kategori</label>
                            <select name="prod_kategori" id="prod_kategori" class="form-control">
                                <option value="">Nama Sales</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Nama Item</label>
                            <select name="item" id="item" class="form-control">
                                <option value="">Nama Sales</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Material</label>
                            <select name="material" id="material" class="form-control">
                                <option value="">Nama Sales</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Quantity</label>
                            <input type="number" name="qty" id="qty" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Panjang</label>
                            <input type="number" name="panjang" id="panjang" class="form-control" step="0.01" min="0" placeholder="0.00">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Lebar</label>
                            <input type="number" name="lebar" id="lebar" class="form-control" step="0.01" min="0" placeholder="0.00">
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Media Tempel</label>
                            <input type="text" name="media_tempel" id="media_tempel" class="form-control" placeholder="Botol">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Packing Layout</label>
                            <input type="text" name="packing_layout" id="packing_layout" class="form-control">
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="form-group">
                            <label for="email2">Diecut Shape</label>
                            <select name="die_shape" id="die_shape" class="form-control">
                                <option value="">Nama Sales</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>