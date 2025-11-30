<div class="sidebar sidebar-style-2">
  <div class="sidebar-wrapper scrollbar scrollbar-inner">
    <div class="sidebar-content">
      <div class="user">
        <div class="avatar-sm float-left mr-2">
          <img src="<?= base_url('') ?>assets/template/assets/img/profile.jpg" alt="..." class="avatar-img rounded-circle">
        </div>
        <div class="info">
          <a data-toggle="collapse" href="#collapseExample" aria-expanded="true">
            <span>
              <?= $this->session->userdata('name') ?><br>
              <small><?= $this->session->userdata('bagian') ?></small>
              <!-- <span class="user-level">Administrator</span> -->
              <!-- <span class="caret"></span> -->
            </span>
          </a>
          <div class="clearfix"></div>
        </div>
      </div>

      <?php
      // Pastikan helper tersedia (fallback kalau belum di-autoload)
      if (!function_exists('get_modul_akses_user')) {
        $CI = &get_instance();
        $CI->load->helper('akses');
      }

      // Ambil data modul & URL aktif
      $modul_akses = get_modul_akses_user(); // object result dari M_user->get_modul_with_access()
      $current_uri = strtolower(trim(uri_string(), '/'));
      ?>

      <ul class="nav nav-primary">
        <!-- Dashboard selalu muncul -->
        <li class="nav-item <?= ($current_uri === 'dashboard') ? 'active' : '' ?>">
          <a href="<?= site_url('Dashboard') ?>">
            <i class="fas fa-home"></i>
            <p>Dashboard</p>
          </a>
        </li>

        <?php if (!empty($modul_akses)): ?>
          <?php foreach ($modul_akses as $modul): ?>
            <?php
            // Normalisasi URL modul
            $mod_url   = strtolower(trim($modul->url_modul ?? '', '/'));
            $mod_icon  = $modul->icon ?? 'fas fa-layer-group';
            $mod_name  = $modul->name ?? 'Modul';
            $mod_id    = $modul->id ?? 0;

            // Ambil menu yang user punya akses untuk modul ini
            $menus = get_menu_akses_user($mod_id); // object result dari M_user->get_menu_with_access()
            $menus = is_array($menus) ? $menus : []; // guard

            // Cek active state
            $moduleActive = ($mod_url !== '' && $current_uri === $mod_url);

            // Cek apakah ada menu & apakah salah satunya aktif
            $hasMenus = count($menus) > 0;
            $anyMenuActive = false;
            foreach ($menus as $mn) {
              $mn_url = strtolower(trim($mn->url ?? '', '/'));
              if ($mn_url !== '' && $mn_url === $current_uri) {
                $anyMenuActive = true;
                break;
              }
            }

            // Untuk collapse state
            $expanded = ($moduleActive || $anyMenuActive);
            $collapseId = 'modul_' . $mod_id;
            ?>

            <?php if ($hasMenus): ?>
              <!-- MODUL DENGAN MENU (pakai collapse) -->
              <li class="nav-item <?= $expanded ? 'active' : '' ?>">
                <a data-toggle="collapse" href="#<?= $collapseId ?>" <?= $expanded ? 'aria-expanded="true"' : 'aria-expanded="false"' ?>>
                  <i class="<?= $mod_icon ?>"></i>
                  <p><?= $mod_name ?></p>
                  <span class="caret"></span>
                </a>
                <div class="collapse <?= $expanded ? 'show' : '' ?>" id="<?= $collapseId ?>">
                  <ul class="nav nav-collapse">
                    <?php foreach ($menus as $mn): ?>
                      <?php
                      $mn_url  = strtolower(trim($mn->url ?? '', '/'));
                      $mn_name = $mn->name ?? '';
                      $isActiveMenu = ($mn_url !== '' && $mn_url === $current_uri);
                      ?>
                      <li class="<?= $isActiveMenu ? 'active' : '' ?>">
                        <a href="<?= site_url($mn->url) ?>">
                          <span class="sub-item"><?= $mn_name ?></span>
                        </a>
                      </li>
                    <?php endforeach; ?>
                  </ul>
                </div>
              </li>
            <?php else: ?>
              <!-- MODUL TANPA MENU (tampil seperti Dashboard) -->
              <li class="nav-item <?= $moduleActive ? 'active' : '' ?>">
                <a href="<?= site_url($modul->url_modul) ?>">
                  <i class="<?= $mod_icon ?>"></i>
                  <p><?= $mod_name ?></p>
                </a>
              </li>
            <?php endif; ?>
          <?php endforeach; ?>
        <?php endif; ?>
      </ul>
    </div>
  </div>
</div>
<div class="main-panel">