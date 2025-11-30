<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Container extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
        // // $this->load->library('Pdf');
        // $this->load->model('M_dashboard', 'dash');
    }

    public function Index()
    {
        $data = [
            'title' => 'Master Container',
            'conten' => 'container/index',
            'footer_js' => array('assets/js/container.js')
        ];
        $this->load->view('template/conten', $data);
    }

    function tableContainer()
    {
        $data['container'] = $this->m_data->get_data('tbl_master_container')->result();

        echo json_encode($this->load->view('container/container-table', $data, false));
    }

    function store()
    {
        $id = $this->input->post('id');
        if ($id != null) {
            $table = 'tbl_master_container';
            $dataupdate = [
                'name' => $this->input->post('container_type'),
                'in_length' => $this->input->post('i_panjang'),
                'in_width' => $this->input->post('i_lebar'),
                'in_height' => $this->input->post('i_tinggi'),
                'volume' => $this->input->post('volume'),
                'd_with' => $this->input->post('d_lebar'),
                'd_height' => $this->input->post('d_tinggi'),
                'tare_weight' => $this->input->post('tare'),
                'max_gros_weight' => $this->input->post('gross'),
                'max_payload' => $this->input->post('max_payload'),
                'updated_at' => date('Y-m-d H:i:s'),
            ];
            $where = array('id' => $id);
            $this->m_data->update_data($table, $dataupdate, $where);
        } else {
            $table = 'tbl_master_container';
            $data = [
                'name' => $this->input->post('container_type'),
                'in_length' => $this->input->post('i_panjang'),
                'in_width' => $this->input->post('i_lebar'),
                'in_height' => $this->input->post('i_tinggi'),
                'volume' => $this->input->post('volume'),
                'd_with' => $this->input->post('d_lebar'),
                'd_height' => $this->input->post('d_tinggi'),
                'tare_weight' => $this->input->post('tare'),
                'max_gros_weight' => $this->input->post('gross'),
                'max_payload' => $this->input->post('max_payload'),
                'created_at' => date('Y-m-d H:i:s'),
                'status' => '1'
            ];
            // $die(var_dump($data));
            $this->m_data->simpan_data($table, $data);
        }
        echo json_encode(['status' => 'success']);
    }

    public function get_data($id)
    {
        $table = 'tbl_master_container';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();

        if ($data) {
            echo json_encode($data);
        } else {
            echo json_encode(['error' => 'Data tidak ditemukan']);
        }
    }
}
