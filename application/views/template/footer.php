<footer class="footer">
    <div class="container-fluid d-flex justify-content-center">
        <div class="copyright">
            2025, made with by <a href="https://www.laprintjaya.com">IT PT. Laprint Jaya</a>
        </div>
    </div>
</footer>

</div>
<!-- Custom template | don't include it in your project! -->
<div class="custom-template">

	<!-- End Custom template -->
</div>
<!--   Core JS Files   -->
<script src="<?= base_url() ?>assets/template/assets/js/core/jquery.3.2.1.min.js"></script>
<script src="<?= base_url() ?>assets/template/assets/js/core/popper.min.js"></script>
<script src="<?= base_url() ?>assets/template/assets/js/core/bootstrap.min.js"></script>

<!-- jQuery UI -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jquery-ui-touch-punch/jquery.ui.touch-punch.min.js"></script>

<!-- jQuery Scrollbar -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js"></script>


<!-- Chart JS -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/chart.js/chart.min.js"></script>

<!-- jQuery Sparkline -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jquery.sparkline/jquery.sparkline.min.js"></script>

<!-- Chart Circle -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/chart-circle/circles.min.js"></script>

<!-- Datatables -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/datatables/datatables.min.js"></script>

<!-- Bootstrap Notify -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/bootstrap-notify/bootstrap-notify.min.js"></script>

<!-- jQuery Vector Maps -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jqvmap/jquery.vmap.min.js"></script>
<script src="<?= base_url() ?>assets/template/assets/js/plugin/jqvmap/maps/jquery.vmap.world.js"></script>

<!-- Sweet Alert -->
 <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<!-- <script src="<?= base_url() ?>assets/template/assets/js/plugin/sweetalert/sweetalert.min.js"></script> -->

<!-- Atlantis JS -->
<script src="<?= base_url() ?>assets/template/assets/js/atlantis.min.js"></script>

<!-- Atlantis DEMO methods, don't include it in your project! -->
<script src="<?= base_url() ?>assets/template/assets/js/setting-demo.js"></script>
<script src="<?= base_url() ?>assets/template/assets/js/demo.js"></script>

<!-- Datatables -->
<script src="<?= base_url() ?>assets/template/assets/js/plugin/datatables/datatables.min.js"></script>

<!-- DataTables Buttons CSS -->
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap4.min.css">

<!-- DataTables Buttons JS -->
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap4.min.js"></script>


<script src="<?= base_url() ?>assets/other/select2.min.js"></script>
<script>
  var BASE_URL = "<?php echo base_url(); ?>";
</script>
<?php
if (isset($footer_js)) {
    foreach ($footer_js as $fjs) { ?>
        <script type="text/javascript" src="<?= base_url($fjs) ?>"></script>
<?php }
} ?>
</body>

</html>