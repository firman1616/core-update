<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Modul extends CI_Controller {

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
			'title' => 'Modul',
			'conten' => 'modul/index',
			'footer_js' => array('assets/js/modul.js')
		];
		$this->load->view('template/conten',$data);
	}

	function tableModul()
    {
        $data['modul'] = $this->m_data->get_data('tbl_modul')->result();

        echo json_encode($this->load->view('modul/modul-table',$data,false));
    }

	function store()
    {
        $id = $this->input->post('id');
        if ($id != null) {
            $table = 'tbl_modul';
            $dataupdate = [
                'name' => $this->input->post('nama_modul'),
                'icon' => $this->input->post('icon_modul'),
                'url_modul' => $this->input->post('url_modul')
            ];
            $where = array('id' => $id);
            $this->m_data->update_data($table, $dataupdate, $where);
        } else {
            $table = 'tbl_modul';
            $data = [
                'name' => $this->input->post('nama_modul'),
                'icon' => $this->input->post('icon_modul'),
                'url_modul' => $this->input->post('url_modul')
            ];
            // $die(var_dump($data));
            $this->m_data->simpan_data($table, $data);
        }
    }

    function vedit($id)
    {
        $table = 'tbl_modul';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();
        echo json_encode($data);
    }
}
