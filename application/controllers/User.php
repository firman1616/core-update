<?php
defined('BASEPATH') or exit('No direct script access allowed');

class User extends CI_Controller
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
            'title' => 'User',
            'conten' => 'user/index',
            'footer_js' => array('assets/js/user.js'),
            'bagian' => $this->m_data->get_bagian()->result()
        ];
        $this->load->view('template/conten', $data);
    }

    function tableUser()
    {
        $data['user'] = $this->m_data->get_data('tbl_user')->result();

        echo json_encode($this->load->view('user/user-table', $data, false));
    }

    function store()
    {
        $id = $this->input->post('id');
        if ($id != null) {
            $table = 'tbl_user';
            $dataupdate = [
                'nik' => $this->input->post('nik'),
                'name' => $this->input->post('nama_user'),
                'bagian' => $this->input->post('bagian'),
                'username' => $this->input->post('username'),
                'password' => password_hash($this->input->post('password'), PASSWORD_BCRYPT),
                'status' => '1',
            ];
            $where = array('id' => $id);
            $this->m_data->update_data($table, $dataupdate, $where);
        } else {
            $table = 'tbl_user';
            $data = [
                'nik' => $this->input->post('nik'),
                'name' => $this->input->post('nama_user'),
                'bagian' => $this->input->post('bagian'),
                'username' => $this->input->post('username'),
                'password' => password_hash($this->input->post('password'), PASSWORD_BCRYPT),
                'status' => '1',
                'created_at'  => date('Y-m-d H:i:s'),
            ];
            // $die(var_dump($data));
            $this->m_data->simpan_data($table, $data);
        }
    }

    public function user_akses($id)
    {
        // Ambil user dan data umum
        $user  = $this->m_data->get_data_by_id('tbl_user', ['id' => $id])->row();
        $modul = $this->m_data->get_data('tbl_modul')->result();
        $role  = $this->m_data->get_data('tbl_role')->result();

        // Ambil data akses modul
        $akses_data = $this->db
            ->where('user_id', $id)
            ->get('tbl_user_modul_akses')
            ->result();

        // Mapping modul_id => role_id
        $akses_map = [];
        foreach ($akses_data as $a) {
            $akses_map[$a->modul_id] = $a->role_id;
        }

        // Ambil semua menu
        $menus = $this->m_data->get_data('tbl_menu')->result();

        // Kelompokkan menu berdasarkan modul_id
        $menus_by_modul = [];
        foreach ($menus as $menu) {
            $menus_by_modul[$menu->modul_id][] = $menu;
        }

        // Ambil data akses menu
        $akses_menu_data = $this->db
            ->where('user_id', $id)
            ->get('tbl_user_menu_akses')
            ->result();

        // Mapping menu_id => role_id
        $akses_menu_map = [];
        foreach ($akses_menu_data as $am) {
            $akses_menu_map[$am->menu_id] = $am->role_id;
        }

        // Kirim semua data ke view
        $data = [
            'title'           => 'User Akses',
            'conten'          => 'user/user-akses',
            'footer_js'       => ['assets/js/user.js'],
            'akses'           => $this->m_data->get_data_by_id('tbl_user', ['id' => $id])->result(),
            'user'            => $user,
            'modul'           => $modul,
            'role'            => $role,
            'akses_map'       => $akses_map,       // preselect role modul
            'menus_by_modul'  => $menus_by_modul,  // list menu per modul
            'akses_menu_map'  => $akses_menu_map   // preselect role menu
        ];

        $this->load->view('template/conten', $data);
    }

    // public function update_akses($user_id)
    // {
    //     $modul_id = $this->input->post('modul_id');
    //     $role_id  = $this->input->post('role_id');

    //     // Hapus akses lama
    //     $this->db->where('user_id', $user_id);
    //     $this->db->delete('tbl_user_modul_akses');

    //     for ($i = 0; $i < count($modul_id); $i++) {
    //         if (!empty($modul_id[$i]) && !empty($role_id[$i])) {
    //             $this->db->insert('tbl_user_modul_akses', [
    //                 'user_id'  => $user_id,
    //                 'modul_id' => $modul_id[$i],
    //                 'role_id'  => $role_id[$i]
    //             ]);
    //         }
    //     }

    //     echo json_encode(['status' => 'ok']);
    // }

    public function update_akses($user_id)
    {
        $modul_id       = $this->input->post('modul_id');
        $role_id_modul  = $this->input->post('role_id_modul'); // role modul
        $menu_id        = $this->input->post('menu_id');
        $role_id_menu   = $this->input->post('role_id_menu');  // role menu

        // ==========================
        // HAPUS AKSES LAMA
        // ==========================
        $this->db->where('user_id', $user_id)->delete('tbl_user_modul_akses');
        $this->db->where('user_id', $user_id)->delete('tbl_user_menu_akses');

        // ==========================
        // SIMPAN MODUL
        // ==========================
        if (!empty($modul_id) && !empty($role_id_modul)) {
            foreach ($modul_id as $m_id) {
                if (!empty($m_id) && !empty($role_id_modul[$m_id])) {
                    $this->db->insert('tbl_user_modul_akses', [
                        'user_id'  => $user_id,
                        'modul_id' => $m_id,
                        'role_id'  => $role_id_modul[$m_id]
                    ]);
                }
            }
        }

        // ==========================
        // SIMPAN MENU
        // ==========================
        if (!empty($menu_id) && !empty($role_id_menu)) {
            foreach ($menu_id as $mn_id) {
                if (!empty($mn_id) && !empty($role_id_menu[$mn_id])) {
                    $this->db->insert('tbl_user_menu_akses', [
                        'user_id' => $user_id,
                        'menu_id' => $mn_id,
                        'role_id' => $role_id_menu[$mn_id]
                    ]);
                }
            }
        }

        echo json_encode(['status' => 'ok']);
    }

    function vedit($id)
    {
        $table = 'tbl_user';
        $where = array('id' => $id);
        $data = $this->m_data->get_data_by_id($table, $where)->row();
        echo json_encode($data);
    }
}
