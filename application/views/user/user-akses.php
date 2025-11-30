<?php
foreach ($akses as $row) {
    $name = $row->name;
    $id = $row->id;
}
?>

<div class="content">
    <div class="page-inner">
        <div class="page-header">
            <h4 class="page-title"><?= $title ?></h4>
        </div>
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Akses <?= $name ?></h4>
            </div>
            <div class="card-body">
                <form id="formAkses" data-user-id="<?= $id ?>">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Modul / Menu</th>
                                <th>Akses Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($modul as $m) { ?>
                                <!-- Modul -->
                                <tr style="background-color: #e9ecef; font-weight: bold; border-top: 2px solid #ccc;">
                                    <td>
                                        <?= $m->name ?>
                                        <input type="hidden" name="modul_id[]" value="<?= $m->id ?>">
                                    </td>
                                    <td>
                                        <select name="role_id_modul[<?= $m->id ?>]" class="form-control form-control-sm">
                                            <option value=""></option>
                                            <?php foreach ($role as $r) { ?>
                                                <option value="<?= $r->id ?>"
                                                    <?= (isset($akses_map[$m->id]) && $akses_map[$m->id] == $r->id) ? 'selected' : '' ?>>
                                                    <?= $r->nama_role ?>
                                                </option>
                                            <?php } ?>
                                        </select>
                                    </td>
                                </tr>

                                <!-- Menu -->
                                <?php if (!empty($menus_by_modul[$m->id])): ?>
                                    <?php foreach ($menus_by_modul[$m->id] as $menu) { ?>
                                        <tr style="background-color: #fff;">
                                            <td style="padding-left: 30px;">
                                                &#8627; <?= $menu->name ?>
                                                <input type="hidden" name="menu_id[]" value="<?= $menu->id ?>">
                                            </td>
                                            <td>
                                                <select name="role_id_menu[<?= $menu->id ?>]" class="form-control form-control-sm">
                                                    <option value=""></option>
                                                    <?php foreach ($role as $r) { ?>
                                                        <option value="<?= $r->id ?>"
                                                            <?= (isset($akses_menu_map[$menu->id]) && $akses_menu_map[$menu->id] == $r->id) ? 'selected' : '' ?>>
                                                            <?= $r->nama_role ?>
                                                        </option>
                                                    <?php } ?>
                                                </select>
                                            </td>
                                        </tr>
                                    <?php } ?>
                                <?php endif; ?>
                            <?php } ?>
                        </tbody>
                    </table>
                    <button type="submit" class="btn btn-primary btn-sm">
                        <i class="fa fa-save"></i> | Simpan Akses
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
