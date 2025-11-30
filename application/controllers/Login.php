<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Login extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        $this->load->model('M_user', 'user');
    }

    public function index()
    {
        $data = [
            'title' => 'Login',
        ];
        $this->load->view('login', $data);
    }

    public function login_action()
    {
        $username = trim($this->input->post('username', TRUE));
        $password = $this->input->post('password', TRUE);

        $user = $this->user->get_by_username($username);

        // Cek user & password
        if ($user && password_verify($password, $user->password)) {

            // (Opsional) Cek apakah user aktif
            if (isset($user->is_active) && !$user->is_active) {
                $this->session->set_flashdata('error', 'Akun Anda tidak aktif.');
                redirect('login');
                return;
            }

            // Ambil modul & menu sesuai akses user (Dashboard otomatis dikecualikan di model)
            $modul_akses = $this->user->get_modul_by_user($user->id);

            // Pastikan dalam format array biasa sebelum masuk session
            $modul_akses = json_decode(json_encode($modul_akses), true);

            $session_data = [
                'id_user'     => $user->id,
                'username'    => $user->username,
                'name'        => $user->name,
                'logged_in'   => TRUE,
                'modul_akses' => $modul_akses,
                'bagian'      => $user->bagian,
            ];

            $this->session->set_userdata($session_data);
            // Redirect ke halaman default
            redirect('dashboard');
        } else {
            $this->session->set_flashdata('error', 'Username atau Password salah!');
            redirect('login');
        }
    }


    public function logout()
    {
        $this->session->sess_destroy();
        $this->session->set_flashdata('logout', 'Anda berhasil logout.');
        redirect('login');
    }
}
