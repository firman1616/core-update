<?php
defined('BASEPATH') or exit('No direct script access allowed');

class M_winpass extends CI_Model
{
    // === Ambil semua user dengan info host ===
    public function get_all_users()
    {
        $this->db->select('u.id, h.hostname, u.username, u.pwd_expiry, u.failed_attempts, u.locked, u.last_checked');
        $this->db->from('tbl_winpass_user u');
        $this->db->join('tbl_winpass_host h', 'h.id = u.host_id', 'left');
        $this->db->order_by('h.hostname, u.username');
        return $this->db->get()->result();
    }

    // === Ambil user berdasarkan host ===
    public function get_users_by_host($host_id)
    {
        return $this->db->get_where('tbl_winpass_user', ['host_id' => $host_id])->result();
    }

    // === Ambil host aktif ===
    public function get_hosts()
    {
        return $this->db->get_where('tbl_winpass_host', ['is_active' => true])->result();
    }

    // === Cari user ID berdasarkan username ===
    public function get_user_id($username)
    {
        $row = $this->db->get_where('tbl_winpass_user', ['username' => $username])->row();
        return $row ? $row->id : null;
    }

    // === Ambil task pending berdasarkan host ===
    public function get_pending_tasks($host_id)
    {
        return $this->db->get_where('tbl_winpass_task', [
            'host_id' => $host_id,
            'status'  => 'PENDING'
        ])->result();
    }

    // === Simpan log event dari agent ===
    public function insert_log($data)
    {
        return $this->db->insert('tbl_winpass_log', $data);
    }

    // === Update status user (misal dari agent sync) ===
    public function update_user_status($host_id, $username, $data)
    {
        $this->db->where(['host_id' => $host_id, 'username' => $username]);
        return $this->db->update('tbl_winpass_user', $data);
    }

    // === Ambil semua task ===
    public function get_all_tasks()
    {
        $this->db->select('t.id, h.hostname, t.username, t.action, t.param, t.status, t.created_at, t.updated_at');
        $this->db->from('tbl_winpass_task t');
        $this->db->join('tbl_winpass_host h', 'h.id = t.host_id', 'left');
        $this->db->order_by('t.created_at', 'desc');
        return $this->db->get()->result();
    }

    // === Ambil semua log ===
    public function get_all_logs()
    {
        $this->db->select('l.id, h.hostname, l.username, l.event_type, l.message, l.created_at');
        $this->db->from('tbl_winpass_log l');
        $this->db->join('tbl_winpass_host h', 'h.id = l.host_id', 'left');
        $this->db->order_by('l.created_at', 'desc');
        return $this->db->get()->result();
    }

    // ================================================================
    // === Tambahan fungsi untuk aksi dari panel admin (task builder) ===
    // ================================================================

    private function _get_user_by_id($id)
    {
        return $this->db->get_where('tbl_winpass_user', ['id' => $id])->row();
    }

    private function _insert_task_and_log($user, $action, $param, $message)
    {
        // Insert ke task table (untuk agent)
        $this->db->insert('tbl_winpass_task', [
            'host_id'    => $user->host_id,
            'username'   => $user->username,
            'action'     => strtoupper($action),
            'param'      => $param,
            'status'     => 'PENDING',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        // Insert ke log (untuk histori admin)
        $this->db->insert('tbl_winpass_log', [
            'host_id'    => $user->host_id,
            'username'   => $user->username,
            'event_type' => strtoupper($action),
            'message'    => $message,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    // === Reset password ===
    public function reset_password($id, $new_password)
    {
        $user = $this->_get_user_by_id($id);
        if (!$user) return false;

        // Update local
        $this->db->where('id', $id)->update('tbl_winpass_user', ['last_checked' => date('Y-m-d H:i:s')]);

        // Catat task & log
        $this->_insert_task_and_log($user, 'RESET_PASSWORD', $new_password, 'Password direset melalui panel admin.');
        return true;
    }

    // === Set expiry date ===
    public function set_expiry_date($id, $expiry_date)
    {
        $user = $this->_get_user_by_id($id);
        if (!$user) return false;

        $this->db->where('id', $id)->update('tbl_winpass_user', ['pwd_expiry' => $expiry_date]);
        $this->_insert_task_and_log($user, 'SET_EXPIRY_DATE', $expiry_date, 'Expiry date diubah ke ' . $expiry_date);
        return true;
    }

    // === Enable user ===
    public function enable_user($id)
    {
        $user = $this->_get_user_by_id($id);
        if (!$user) return false;

        $this->db->where('id', $id)->update('tbl_winpass_user', ['locked' => 'enabled']);
        $this->_insert_task_and_log($user, 'ENABLE_USER', '-', 'User diaktifkan oleh admin.');
        return true;
    }

    // === Disable user ===
    public function disable_user($id)
    {
        $user = $this->_get_user_by_id($id);
        if (!$user) return false;

        $this->db->where('id', $id)->update('tbl_winpass_user', ['locked' => 'disabled']);
        $this->_insert_task_and_log($user, 'DISABLE_USER', '-', 'User dinonaktifkan oleh admin.');
        return true;
    }

    // === Unlock user ===
    public function unlock_user($id)
    {
        $user = $this->_get_user_by_id($id);
        if (!$user) return false;

        $this->db->where('id', $id)->update('tbl_winpass_user', ['locked' => 'enabled']);
        $this->_insert_task_and_log($user, 'UNLOCK_USER', '-', 'User di-unlock (locked_by_policy → enabled).');
        return true;
    }
}
