<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Menu extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('M_setting', 'set');
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
    }

    public function index()
    {
        $data = [
            'title' => 'Menu',
            'conten' => 'menu/index',
            'footer_js' => array('assets/js/menu.js'),
            'modul' => $this->m_data->get_modul()->result()
        ];
        $this->load->view('template/conten', $data);
    }

    function tableMenu()
    {
        $data['menu'] = $this->set->get_data_menu()->result();

        echo json_encode($this->load->view('menu/menu-table', $data, false));
    }

    function store()
    {
        $id = $this->input->post('id');
        if ($id != null) {
            $table = 'tbl_menu';
            $dataupdate = [
                'name' => $this->input->post('nama_menu'),
                'url' => $this->input->post('url_menu'),
                'modul_id' => $this->input->post('modul')
            ];
            $where = array('id' => $id);
            $this->m_data->update_data($table, $dataupdate, $where);
        } else {
            $table = 'tbl_menu';
            $data = [
                'name' => $this->input->post('nama_menu'),
                'url' => $this->input->post('url_menu'),
                'modul_id' => $this->input->post('modul')
            ];
            // $die(var_dump($data));
            $this->m_data->simpan_data($table, $data);
        }
    }

    function vedit($id)
    {
        $table = 'tbl_menu';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();
        echo json_encode($data);
    }


    function storesubMenu()
    {
        $id = $this->input->post('id');
        if ($id != null) {
            $table = 'tbl_sub_menu';
            $dataupdate = [
                'name' => $this->input->post('nama_sub_menu'),
                'url_sub' => $this->input->post('url_sub_menu'), // sesuai form
                'menu_id' => $this->input->post('menu_id'),
            ];
            $where = array('id' => $id);
            $this->m_data->update_data($table, $dataupdate, $where);
        } else {
            $table = 'tbl_sub_menu';
            $data = [
                'name' => $this->input->post('nama_sub_menu'),
                'url_sub' => $this->input->post('url_sub_menu'), // sesuai form
                'menu_id' => $this->input->post('menu_id'),
            ];
            // $die(var_dump($data));
            $this->m_data->simpan_data($table, $data);
        }
        echo json_encode(['status' => 'success']);
    }

    public function simpanSubMenu()
    {
        $id = $this->input->post('id');
        $name = $this->input->post('nama_sub_menu'); // sesuai form
        $url_sub = $this->input->post('url_sub_menu'); // sesuai form
        $menu_id = $this->input->post('menu_id');

        $data = [
            'name' => $name,
            'url_sub' => $url_sub,
            'menu_id' => $menu_id,
        ];

        if ($id) {
            // UPDATE menggunakan model
            $this->M_data->update_data('tbl_sub_menu', $data, ['id' => $id]);
            echo json_encode(['status' => 'updated']);
        } else {
            // INSERT menggunakan model
            $this->M_data->simpan_data('tbl_sub_menu', $data);
            echo json_encode(['status' => 'inserted']);
        }
    }

    public function getSubMenuByMenuId()
    {
        $menu_id = $this->input->post('menu_id');
        $where = ['menu_id' => $menu_id];
        $query = $this->M_data->get_data_by_id('tbl_sub_menu', $where);

        echo json_encode($query->result());
    }

    function delete($id)  {
        $table = 'tbl_menu';
        $where = array('id'=>$id);
        $this->m_data->hapus_data($table,$where);
    }
}
