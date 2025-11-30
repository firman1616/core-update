<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Dashboard extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
        $this->load->model('M_user','user'); // pastikan model dimuat
    }
    
    public function index()
    {
        $user_id = $this->session->userdata('id');
        $modul_akses = $this->user->get_modul_with_access($user_id); // ambil menu akses user

        $data = [
            'title'        => 'Dashboard',
            'conten'       => 'conten/dashboard',
            'modul_akses'  => $modul_akses // kirim ke view
        ];
        
        $this->load->view('template/conten', $data);
    }
}
