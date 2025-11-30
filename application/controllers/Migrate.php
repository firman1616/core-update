<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migrate extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->library('migration');
    }

    public function index($version = NULL)
    {
        if ($version === NULL) {
            // Jalankan migrasi ke versi terbaru
            if ($this->migration->latest() === FALSE) {
                show_error($this->migration->error_string());
            } else {
                echo "Migrasi berhasil dijalankan ke versi terbaru.";
            }
        } else {
            // Migrasi ke versi tertentu
            if ($this->migration->version($version) === FALSE) {
                show_error($this->migration->error_string());
            } else {
                echo "Migrasi berhasil dijalankan ke versi " . $version;
            }
        }
    }
}
