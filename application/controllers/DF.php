<?php
defined('BASEPATH') or exit('No direct script access allowed');

class DF extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
    }

    public function index()
    {
        $data = [
            'title' => 'Data Form',
            'conten' => 'data_form/index',
            'footer_js' => array('assets/js/data_form.js'),
        ];
        $this->load->view('template/conten', $data);
    }

    function tableDataForm()
    {
        // $data['stuff'] = $this->stuff->get_data_stuffing()->result();
        $canAdd = cek_menu_akses(3, 1); // modul, menu, akses jika tidak ada menu maka menu otomatis = null
        $html = $this->load->view('data_form/data-form-table', [], TRUE);

        echo json_encode([
            'html' => $html,
            'canAdd' => $canAdd
        ]);
    }

    function store()
    {
        $id = $this->input->post('id');
        $kode_bagian = trim($this->input->post('kode_bagian'));
        $nama_bagian = trim($this->input->post('nama_bagian'));
        $table = 'tbl_bagian';

        // 🔍 Cek apakah kode_bagian sudah ada
        $this->db->where('kode_bagian', $kode_bagian);
        if ($id) $this->db->where('id !=', $id); // abaikan diri sendiri saat update
        $cek_kode = $this->db->get($table)->num_rows();

        if ($cek_kode > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Kode Bagian sudah ada di database!']);
            return;
        }

        // 🔍 Cek apakah nama_bagian sudah ada
        $this->db->where('nama_bagian', $nama_bagian);
        if ($id) $this->db->where('id !=', $id);
        $cek_nama = $this->db->get($table)->num_rows();

        if ($cek_nama > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Nama Bagian sudah ada di database!']);
            return;
        }

        // ✅ Jika tidak duplikat, lanjut insert atau update
        if ($id != null) {
            $dataupdate = [
                'kode_bagian' => $kode_bagian,
                'nama_bagian' => $nama_bagian,
            ];
            $where = ['id' => $id];
            $this->m_data->update_data($table, $dataupdate, $where);
            echo json_encode(['status' => 'success', 'message' => 'Data berhasil diperbarui!']);
        } else {
            $data = [
                'kode_bagian' => $kode_bagian,
                'nama_bagian' => $nama_bagian,
            ];
            $this->m_data->simpan_data($table, $data);
            echo json_encode(['status' => 'success', 'message' => 'Data berhasil disimpan!']);
        }
    }


    function vedit($id)
    {
        $table = 'tbl_bagian';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();
        echo json_encode($data);
    }
}
