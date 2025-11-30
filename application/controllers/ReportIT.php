<?php
defined('BASEPATH') or exit('No direct script access allowed');

class ReportIT extends CI_Controller
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
            'title' => 'Report IT',
            'conten' => 'report_it/index',
            'footer_js' => array('assets/js/reportit.js'),
            'get_data' => $this->m_data->get_data('tbl_report_it'),
        ];
        $this->load->view('template/conten', $data);
    }

    function tableModul()
    {
        $data['modul'] = $this->m_data->get_data('tbl_modul')->result();

        echo json_encode($this->load->view('modul/modul-table', $data, false));
    }

    public function store()
    {
        $report_name = $this->input->post('report_name', TRUE);
        $report_url  = $this->input->post('report_url', TRUE);
        $report_icon = $this->input->post('report_icon', TRUE);
        $data = [
            'name' => $report_name,
            'url'  => $report_url,
            'icon' => $report_icon
        ];
        $this->m_data->simpan_data('tbl_report_it', $data);
        echo json_encode([
            'status'  => 'success',
            'message' => 'Report berhasil disimpan'
        ]);
    }

    function vedit($id)
    {
        $table = 'tbl_modul';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();
        echo json_encode($data);
    }
}
