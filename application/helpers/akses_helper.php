<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

function cek_akses($modul_id, $akses_id)
{
    $CI = &get_instance();
    $CI->load->library('session');

    $role_akses = $CI->session->userdata('role_akses');

    return isset($role_akses[$modul_id]) && in_array($akses_id, $role_akses[$modul_id]);
}

function cek_menu_akses($modul_id, $menu_id, $akses_id)
{
    $CI = &get_instance();
    $CI->load->library('session');

    $modul_akses = $CI->session->userdata('modul_akses');

    if (!$modul_akses) return false;

    foreach ($modul_akses as $modul) {
        if ($modul['id'] == $modul_id) {
            foreach ($modul['menus'] as $menu) {
                if ($menu['id'] == $menu_id && in_array($akses_id, $menu['akses'])) {
                    return true;
                }
            }
        }
    }

    return false;
}

function cek_approve_level($modul_id, $menu_id, $required_level)
{
    $CI = &get_instance();
    $CI->load->library('session');

    $modul_akses = $CI->session->userdata('modul_akses');
    if (!$modul_akses) return false;

    foreach ($modul_akses as $modul) {
        if ($modul['id'] == $modul_id) {
            foreach ($modul['menus'] as $menu) {
                // pastikan user punya akses approve (id = 5)
                if ($menu['id'] == $menu_id && in_array(5, $menu['akses'])) {

                    // cek apakah level yang diminta ada di list approve user
                    if (
                        isset($menu['approve_level'])
                        && is_array($menu['approve_level'])
                        && in_array($required_level, $menu['approve_level'])
                    ) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
}



function get_modul_akses_user()
{
    $CI = &get_instance();
    $CI->load->model('M_user');

    // Pakai id_user (fallback ke 'id' kalau ada project lama)
    $user_id = $CI->session->userdata('id_user') ?: $CI->session->userdata('id');
    if (!$user_id) return [];

    return $CI->M_user->get_modul_with_access($user_id); // ini mengembalikan array of OBJECT
}

function get_menu_akses_user($modul_id)
{
    $CI = &get_instance();
    $CI->load->model('M_user');

    $user_id = $CI->session->userdata('id_user') ?: $CI->session->userdata('id');
    if (!$user_id) return [];

    return $CI->M_user->get_menu_with_access($user_id, $modul_id); // array of OBJECT
}
