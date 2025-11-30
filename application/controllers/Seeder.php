<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seeder extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function index()
    {
        // Mulai transaksi biar aman
        $this->db->trans_start();

        /**
         * 1. Insert tbl_user
         */
        $this->db->insert('tbl_user', [
            'name'       => 'administrator',
            'username'   => 'admin',
            'password'   => password_hash('admin', PASSWORD_DEFAULT), // hash password
            'status'     => 1,
            'nik'        => '111',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        /**
         * 2. Insert tbl_modul
         */
        $this->db->insert('tbl_modul', [
            'name'       => 'Setting',
            'icon'       => 'fas fa-wrench',
            'url_modul'  => 'Setting'
        ]);

        /**
         * 3. Insert tbl_menu
         */
        $menus = [
            ['name' => 'Modul', 'url' => 'Modul', 'modul_id' => 1],
            ['name' => 'Menu',  'url' => 'Menu',  'modul_id' => 1],
            ['name' => 'Role',  'url' => 'Role',  'modul_id' => 1],
            ['name' => 'User',  'url' => 'User',  'modul_id' => 1],
        ];

        foreach ($menus as $menu) {
            $this->db->insert('tbl_menu', $menu);
        }

        /**
         * 4. Insert tbl_role
         */
        $this->db->insert('tbl_role', [
            'nama_role' => 'Super User'
        ]);

        /**
         * 5. Insert tbl_user_modul_akses
         */
        $this->db->insert('tbl_user_modul_akses', [
            'user_id'  => 1,
            'modul_id' => 1,
            'role_id'  => 1
        ]);

        /**
         * 6. Insert tbl_role_akses (akses 1 sampai 7, role_id = 1)
         */
        for ($i = 1; $i <= 7; $i++) {
            $this->db->insert('tbl_role_akses', [
                'akses'   => $i,
                'role_id' => 1
            ]);
        }

         /**
         * 7. Insert tbl_user_menu_akses (akses 1 sampai 7, role_id = 1)
         */
        $menu_role = [
            ['user_id' => '1', 'role_id' => '1', 'menu_id' => 1],
            ['user_id' => '1', 'role_id' => '1',  'menu_id' => 2],
            ['user_id' => '1', 'role_id' => '1',  'menu_id' => 3],
            ['user_id' => '1', 'role_id' => '1',  'menu_id' => 4],
        ];

        foreach ($menu_role as $mr) {
            $this->db->insert('tbl_user_menu_akses', $mr);
        }

        // Commit transaksi
        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            echo "Seeder gagal dijalankan.";
        } else {
            echo "Seeder berhasil dijalankan!";
        }
    }
}
