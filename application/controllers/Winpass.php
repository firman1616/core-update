<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Winpass extends CI_Controller
{
    
    public function __construct()
    {
        parent::__construct();

        $no_login_required = ['agent_sync_noauth', 'update_task_status'];
        $current_method = $this->router->fetch_method();
        if (!in_array($current_method, $no_login_required)) {
            if (!$this->session->userdata('logged_in')) {
                redirect('login');
            }
        }

        $this->load->model('M_winpass', 'winpass');
    }

    public function index()
    {
        $data = [
            'title' => 'Windows Password Management',
            'conten' => 'winpass/index',
            'footer_js' => ['assets/js/winpass.js']
        ];
        $this->load->view('template/conten', $data);
    }

    public function tableWinpass()
    {
        $data['users'] = $this->winpass->get_all_users();
        echo json_encode($this->load->view('winpass/table-winpass', $data, false));
    }

    public function save_user()
    {
        $data = [
            'host_id' => $this->input->post('host_id'),
            'username' => $this->input->post('username'),
            'pwd_expiry' => $this->input->post('pwd_expiry') ?? null,
            'failed_attempts' => 0,
            'locked' => 'enabled',
            'last_checked' => date('Y-m-d H:i:s')
        ];

        $insert = $this->db->insert('tbl_winpass_user', $data);

        if ($insert) {
            $this->db->insert('tbl_winpass_log', [
                'host_id' => $data['host_id'],
                'username' => $data['username'],
                'event_type' => 'NEW_USER',
                'message' => "User baru ditambahkan dengan locked={$data['locked']}",
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        echo json_encode([
            'status' => $insert ? 'success' : 'error',
            'message' => $insert ? 'User berhasil ditambahkan' : 'Gagal menambah user'
        ]);
    }

    // Enable user
    public function enable_user()
    {
        $id = $this->input->post('id');
        $user = $this->db->get_where('tbl_winpass_user',['id'=>$id])->row();
        if(!$user){
            echo json_encode(['status'=>'error','message'=>'User tidak ditemukan']);
            return;
        }

        $ok = $this->db->insert('tbl_winpass_task',[
            'host_id' => $user->host_id,
            'username'=> $user->username,
            'action'  => 'UNLOCK_USER',
            'status'  => 'PENDING',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode(['status'=>$ok?'success':'error','message'=>$ok?'Perintah enable dikirim ke agent':'Gagal membuat task enable']);
    }

    // Disable user
    public function disable_user()
    {
        $id = $this->input->post('id');
        $user = $this->db->get_where('tbl_winpass_user',['id'=>$id])->row();
        if(!$user){
            echo json_encode(['status'=>'error','message'=>'User tidak ditemukan']);
            return;
        }

        $ok = $this->db->insert('tbl_winpass_task',[
            'host_id' => $user->host_id,
            'username'=> $user->username,
            'action'  => 'LOCK_USER',
            'status'  => 'PENDING',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode(['status'=>$ok?'success':'error','message'=>$ok?'Perintah disable dikirim ke agent':'Gagal membuat task disable']);
    }

    // Unlock user (locked_by_policy)
    public function unlock_user()
    {
        $id = $this->input->post('id');
        $user = $this->db->get_where('tbl_winpass_user',['id'=>$id])->row();
        if(!$user){
            echo json_encode(['status'=>'error','message'=>'User tidak ditemukan']);
            return;
        }

        $ok = $this->db->insert('tbl_winpass_task',[
            'host_id' => $user->host_id,
            'username'=> $user->username,
            'action'  => 'UNLOCK_BY_POLICY',
            'status'  => 'PENDING',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode(['status'=>$ok?'success':'error','message'=>$ok?'Perintah unlock dikirim ke agent':'Gagal membuat task unlock']);
    }

    public function update_status()
{
    $username = $this->input->post('username');
    $action   = $this->input->post('action');
    $executor = $this->session->userdata('username') ?? 'system';
    $host_id  = $this->session->userdata('host_id') ?? 'default';

    $user = $this->db->get_where('tbl_winpass_user', ['username' => $username])->row();
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
        return;
    }

    $locked_val = null;
    $desc = '';

    if ($action == 'enable') {
        $locked_val = '0';
        $desc = 'User enabled';
    } elseif ($action == 'disable') {
        $locked_val = '1';
        $desc = 'User disabled';
    } elseif ($action == 'unlock') {
        $locked_val = '0';
        $desc = 'User unlocked';
    }

    // Update status di tbl_winpass_user
    if ($locked_val !== null) {
        $this->db->where('username', $username)->update('tbl_winpass_user', [
            'locked' => $locked_val
        ]);
    }

    // Insert ke tbl_winpass_task
    $this->db->insert('tbl_winpass_task', [
        'host_id'    => $host_id,
        'username'   => $username,
        'action'     => $action,
        'param'      => '',
        'status'     => 'pending',
        'message'    => $desc,
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    // Insert ke tbl_winpass_log
    $this->db->insert('tbl_winpass_log', [
        'host_id'    => $host_id,
        'username'   => $username,
        'event_type' => $action,
        'message'    => $desc . ' oleh ' . $executor,
        'created_at' => date('Y-m-d H:i:s')
    ]);

    echo json_encode(['success' => true, 'message' => ucfirst($action) . ' berhasil']);
}

public function reset_password()
{
    // Terima id user (bukan username) — sesuai dengan hidden input di view
    $id = $this->input->post('id');
    $new_password = $this->input->post('new_password');
    $executor = $this->session->userdata('username') ?? 'system';

    if (!$this->input->post()) {
        echo json_encode(['success'=>false,'message'=>'No POST data']);
        return;
    }


    if (!$id || !$new_password) {
        echo json_encode(['success' => false, 'message' => 'Parameter tidak lengkap']);
        return;
    }

    $user = $this->db->get_where('tbl_winpass_user', ['id' => $id])->row();
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
        return;
    }

    // Simpan task dengan host_id dari data user (bukan dari session)
    $param = json_encode(['password' => $new_password]);

    $ok = $this->db->insert('tbl_winpass_task', [
        'host_id'    => $user->host_id,
        'username'   => $user->username,
        'action'     => 'RESET_PASSWORD',
        'param'      => $param,
        'status'     => 'PENDING',
        'message'    => 'Password reset requested',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    if ($ok) {
        $this->db->insert('tbl_winpass_log', [
            'host_id'    => $user->host_id,
            'username'   => $user->username,
            'event_type' => 'RESET_PASSWORD',
            'message'    => 'Password reset oleh ' . $executor,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    echo json_encode([
        'success' => (bool)$ok,
        'message' => $ok ? 'Reset password berhasil dimasukkan ke task' : 'Gagal menyimpan task reset password'
    ]);
}

public function set_expiry()
{
    // Terima id user (hidden input) dan expiry_date
    $id = $this->input->post('id');
    $expiry_date = $this->input->post('expiry_date');
    $executor = $this->session->userdata('username') ?? 'system';

    if (!$id || !$expiry_date) {
        echo json_encode(['success' => false, 'message' => 'Parameter tidak lengkap']);
        return;
    }

    $user = $this->db->get_where('tbl_winpass_user', ['id' => $id])->row();
    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
        return;
    }

    // Update local pwd_expiry
    $this->db->where('id', $id)->update('tbl_winpass_user', [
        'pwd_expiry' => $expiry_date
    ]);

    $param = json_encode(['expiry' => $expiry_date]);

    $ok = $this->db->insert('tbl_winpass_task', [
        'host_id'    => $user->host_id,
        'username'   => $user->username,
        'action'     => 'SET_EXPIRY',
        'param'      => $param,
        'status'     => 'PENDING',
        'message'    => 'Set expiry requested',
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    if ($ok) {
        $this->db->insert('tbl_winpass_log', [
            'host_id'    => $user->host_id,
            'username'   => $user->username,
            'event_type' => 'SET_EXPIRY',
            'message'    => 'Expiry date diubah ke ' . $expiry_date . ' oleh ' . $executor,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    echo json_encode([
        'success' => (bool)$ok,
        'message' => $ok ? 'Tanggal kadaluarsa berhasil dimasukkan ke task' : 'Gagal menyimpan task set expiry'
    ]);
}


    // ===== Lock / Unlock lama (tetap ada) =====
    public function lock_account()
    {
        $id = $this->input->post('id');
        $action = strtoupper($this->input->post('action')); // LOCK_USER / UNLOCK_USER

        $user = $this->db->get_where('tbl_winpass_user', ['id' => $id])->row();
        if (!$user) {
            echo json_encode(['status' => 'error', 'message' => 'User tidak ditemukan']);
            return;
        }

        $ok = $this->db->insert('tbl_winpass_task', [
            'host_id' => $user->host_id,
            'username' => $user->username,
            'action' => $action,
            'status' => 'PENDING',
            'created_at' => date('Y-m-d H:i:s')
        ]);

        echo json_encode([
            'status' => $ok ? 'success' : 'error',
            'message' => $ok ? "Perintah $action dikirim ke agent" : "Gagal menyimpan task $action"
        ]);
    }

    public function reset_failed_attempts()
{
    try {
        $id = $this->input->post('id');
        $attempts = $this->input->post('failed_attempts');
        $executor = $this->session->userdata('username') ?? 'system';

        if (!$id || !is_numeric($attempts)) {
            echo json_encode(['success' => false, 'message' => 'Parameter tidak lengkap atau salah']);
            return;
        }

        $user = $this->db->get_where('tbl_winpass_user', ['id' => $id])->row();
        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'User tidak ditemukan']);
            return;
        }

        $this->db->where('id', $id)->update('tbl_winpass_user', ['failed_attempts' => $attempts]);

        $param = json_encode(['failed_attempts' => $attempts]);
        

        $ok = $this->db->insert('tbl_winpass_task', [
            'host_id'    => $user->host_id,
            'username'   => $user->username,
            'action'     => 'RESET_FAILED_ATTEMPTS',
            'param'      => $param,
            'status'     => 'PENDING',
            'message'    => 'Reset failed attempts requested',
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        if ($ok) {
            $this->db->insert('tbl_winpass_log', [
                'host_id'    => $user->host_id,
                'username'   => $user->username,
                'event_type' => 'RESET_FAILED_ATTEMPTS',
                'message'    => "Failed attempts diubah ke {$attempts} oleh {$executor}",
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        echo json_encode(['success' => (bool)$ok, 'message' => $ok ? 'Berhasil dimasukkan ke task' : 'Gagal simpan task']);
    } catch (Exception $e) {
        echo json_encode(['success'=>false,'message'=>'Error: '.$e->getMessage()]);
    }
}


    // ===== Halaman tasks dan logs =====
    public function tasks()
    {
        $data = [
            'title' => 'Windows Tasks',
            'conten' => 'winpass/tasks',
            'footer_js' => ['assets/js/winpass-task.js']
        ];
        $this->load->view('template/conten', $data);
    }

    public function logs()
    {
        $data = [
            'title' => 'Windows Logs',
            'conten' => 'winpass/logs',
            'footer_js' => ['assets/js/winpass-log.js']
        ];
        $this->load->view('template/conten', $data);
    }

    public function tableLog()
    {
        $data['logs'] = $this->db->order_by('created_at', 'DESC')->get('tbl_winpass_log')->result();
        $html = $this->load->view('winpass/table-log', $data, true);
        echo json_encode(['html' => $html]);
    }

    public function tableTask()
    {
        $data['tasks'] = $this->db->order_by('created_at', 'DESC')->get('tbl_winpass_task')->result();
        $html = $this->load->view('winpass/table-task', $data, true);
        echo json_encode(['html' => $html]);
    }

    public function retry_task()
    {
        $id = $this->input->post('id');
        $task = $this->db->get_where('tbl_winpass_task', ['id'=>$id])->row();
        if(!$task){
            echo json_encode(['status'=>'error','message'=>'Task tidak ditemukan']);
            return;
        }
        $ok = $this->db->where('id', $id)->update('tbl_winpass_task',['status'=>'PENDING','created_at'=>date('Y-m-d H:i:s')]);
        echo json_encode(['status' => $ok ? 'success' : 'error','message' => $ok ? 'Task berhasil di-retry' : 'Gagal retry task']);
    }

    public function delete_task()
    {
        $id = $this->input->post('id');
        $ok = $this->db->delete('tbl_winpass_task',['id'=>$id]);
        echo json_encode(['status' => $ok ? 'success' : 'error','message' => $ok ? 'Task berhasil dihapus' : 'Gagal menghapus task']);
    }

    // ===== Agent Sync =====
    public function agent_sync() { $this->_agent_sync(true); }
    public function agent_sync_noauth() { $this->_agent_sync(false); }

    private function _agent_sync($auth_required=true)
    {
        $json = json_decode($this->input->raw_input_stream, true);
        if (!$json) {
            echo json_encode(['status'=>'error','message'=>'Payload tidak valid']);
            return;
        }

        $hostname = $json['hostname'] ?? null;
        $users    = $json['users'] ?? [];
        $events   = $json['events'] ?? [];

        if (!$hostname) {
            echo json_encode(['status'=>'error','message'=>'Hostname tidak ditemukan']);
            return;
        }

        // --- Host ---
        $host = $this->db->get_where('tbl_winpass_host', ['hostname'=>$hostname])->row();
        if (!$host) {
            $this->db->insert('tbl_winpass_host', ['hostname'=>$hostname,'last_seen'=>date('Y-m-d H:i:s')]);
            $host_id = $this->db->insert_id();
        } else {
            $host_id = $host->id;
            $this->db->where('id',$host_id)->update('tbl_winpass_host',['last_seen'=>date('Y-m-d H:i:s')]);
        }

        // --- User update/insert ---
        foreach($users as $u){
            if(!isset($u['username'])) continue;
            $exists = $this->db->get_where('tbl_winpass_user', ['host_id'=>$host_id, 'username'=>$u['username']])->row();

            $locked_val = in_array($u['locked'], ['enabled','disabled','locked_by_policy']) ? $u['locked'] : 'enabled';

            $data_user = [
                'pwd_expiry' => $u['pwd_expiry'] ?? null,
                'failed_attempts' => $u['failed_attempts'] ?? 0,
                'locked' => $locked_val,
                'last_checked' => date('Y-m-d H:i:s')
            ];

            if($exists){
                if($exists->locked != $data_user['locked'] || $exists->pwd_expiry != $data_user['pwd_expiry']){
                    $this->db->insert('tbl_winpass_log', [
                        'host_id' => $host_id,
                        'username' => $u['username'],
                        'event_type' => 'UPDATE_USER',
                        'message' => "locked: {$exists->locked} => {$data_user['locked']}, pwd_expiry: {$exists->pwd_expiry} => {$data_user['pwd_expiry']}",
                        'created_at' => date('Y-m-d H:i:s')
                    ]);
                }
                $this->db->where('id',$exists->id)->update('tbl_winpass_user',$data_user);
            } else {
                $this->db->insert('tbl_winpass_user', array_merge($data_user,['host_id'=>$host_id,'username'=>$u['username']]));
                $this->db->insert('tbl_winpass_log', [
                    'host_id' => $host_id,
                    'username' => $u['username'],
                    'event_type' => 'NEW_USER',
                    'message' => "User baru ditambahkan dengan locked={$data_user['locked']}",
                    'created_at' => date('Y-m-d H:i:s')
                ]);
            }
        }

        // --- Event logs ---
        foreach($events as $e){
            $this->db->insert('tbl_winpass_log', [
                'host_id' => $host_id,
                'username' => $e['username'] ?? null,
                'event_type' => $e['type'] ?? null,
                'message' => $e['message'] ?? null,
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }

        // --- Ambil task pending ---
        $tasks = $this->db->get_where('tbl_winpass_task', ['host_id'=>$host_id,'status'=>'PENDING'])->result();
        foreach($tasks as $t){
            $t->param = $t->param ? json_decode($t->param,true) : null;
        }
        if(!empty($tasks)){
            $ids = array_map(fn($t)=>$t->id,$tasks);
            $this->db->where_in('id',$ids)->update('tbl_winpass_task',['status'=>'SENT']);
        }

        echo json_encode(['status'=>'success','tasks'=>$tasks]);
    }

    public function update_task_status()
    {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input || !isset($input['tasks']) || !isset($input['hostname'])) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(['status'=>'error','message'=>'Invalid payload']));
            return;
        }

        $hostname = $input['hostname'];
        $tasks = $input['tasks'];

        $host = $this->db->get_where('tbl_winpass_host', ['hostname'=>$hostname])->row();
        if (!$host) {
            $this->output
                ->set_status_header(400)
                ->set_output(json_encode(['status'=>'error','message'=>'Host tidak terdaftar']));
            return;
        }
        $host_id = $host->id;

        $result = [];
        foreach ($tasks as $t) {
            $id = $t['id'];
            $status = $t['status'];
            $message = $t['message'] ?? null;

            $task = $this->db->get_where('tbl_winpass_task', ['id'=>$id])->row();
            if (!$task) continue;

            $this->db->where('id', $id)->update('tbl_winpass_task', [
                'status' => $status,
                'message'=> $message,
                'updated_at' => date('Y-m-d H:i:s')
            ]);

            if ($status === 'success') {
                switch ($task->action) {
                    case 'LOCK_USER':
                        $this->db->where(['host_id'=>$task->host_id,'username'=>$task->username])
                                 ->update('tbl_winpass_user', ['locked'=>'disabled']);
                        break;
                    case 'UNLOCK_USER':
                    case 'UNLOCK_BY_POLICY':
                        $this->db->where(['host_id'=>$task->host_id,'username'=>$task->username])
                                 ->update('tbl_winpass_user', ['locked'=>'enabled']);
                        break;
                    case 'SET_EXPIRY':
                        if ($task->param) {
                            $param = json_decode($task->param,true);
                            if (isset($param['expiry'])) {
                                $this->db->where(['host_id'=>$task->host_id,'username'=>$task->username])
                                         ->update('tbl_winpass_user',['pwd_expiry'=>$param['expiry']]);
                            }
                        }
                        break;
                    case 'RESET_PASSWORD':
                        break;
                }
            }

            $this->db->insert('tbl_winpass_log', [
                'host_id'    => $task->host_id,
                'username'   => $task->username,
                'event_type' => $task->action,
                'message'    => $message,
                'created_at' => date('Y-m-d H:i:s')
            ]);

            $result[] = ['id'=>$id,'status'=>$status];
        }

        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode(['status'=>'success','updated'=>$result]));
    }
}
