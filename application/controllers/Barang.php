<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Barang extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
        // // $this->load->library('Pdf');
        $this->load->model('M_acts', 'acts');
    }

    public function Index()
    {
        $data = [
            'title' => 'Master Barang',
            'conten' => 'barang/index',
            'footer_js' => array('assets/js/barang.js')
        ];
        $this->load->view('template/conten', $data);
    }

    // function tableBarang()
    // {
    //     $data['barang'] = $this->acts->get_data_barang()->result();

    //     echo json_encode($this->load->view('barang/barang-table', $data,false));
    // }

    public function getBarang()
    {
        // kamu memanggil $this->acts->get_datatables();
        // padahal di model tidak ada fungsi get_datatables(), yang ada get_datatables_barang()
        $list = $this->acts->get_datatables_barang();
        $data = [];
        $no = $this->input->post('start');

        foreach ($list as $barang) {
            $no++;
            $row = [];
            $row[] = $no;
            $row[] = $barang->Kode_Brg;
            $row[] = $barang->Nama_Brg;
            $row[] = $barang->Pjg;
            $row[] = $barang->Lbr;
            $row[] = $barang->Tgi;
            $row[] = $barang->Vol;
            $row[] = $barang->Brt_Net;
            $data[] = $row;
        }

        $output = [
            "draw" => intval($this->input->post('draw')),
            "recordsTotal" => $this->acts->count_all_barang(),
            "recordsFiltered" => $this->acts->count_filtered_barang(),
            "data" => $data,
        ];

        echo json_encode($output);
    }
}
