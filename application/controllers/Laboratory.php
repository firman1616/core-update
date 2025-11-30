<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Laboratory extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
    }

    public function Index()
    {
        $data = [
            'title' => 'Data Laboratory',
            'conten' => 'laboratory/index',
            'footer_js' => array('assets/js/laboratory.js')
        ];
        $this->load->view('template/conten', $data);
    }

    public function v_tambah()
    {
        $data = [
            'title' => 'Create Laboratory Data',
            'conten' => 'laboratory/tambah-data',
            'footer_js' => array('assets/js/laboratory.js')
        ];
        $this->load->view('template/conten', $data);
    }

    /*
    // Sumbit form
    public function save()
    {
        // ambil input dari form
        $date            = $this->input->post('date');
        $temperature     = $this->input->post('temperature');
        $condition       = $this->input->post('condition');
        $delivery_order  = $this->input->post('delivery_order');

        // validasi sederhana
        if (empty($date) || empty($temperature) || empty($condition) || empty($delivery_order)) {
            $this->session->set_flashdata('error', 'Semua field wajib diisi!');
            redirect('receiving/v_tambah');
        }

        // data untuk insert
        $data = [
            'date'           => $date,
            'temperature'    => $temperature,
            'condition'      => $condition,
            'delivery_order' => $delivery_order,
            'created_at'     => date('Y-m-d H:i:s')
        ];

        // simpan ke database
        $insert = $this->acts->insert_receiving($data);

        if ($insert) {
            $this->session->set_flashdata('success', 'Data berhasil disimpan.');
            redirect('receiving');
        } else {
            $this->session->set_flashdata('error', 'Gagal menyimpan data.');
            redirect('receiving/v_tambah');
        }
    }*/
}
