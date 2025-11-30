<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Stuffing extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
        // // $this->load->library('Pdf');
        $this->load->model('M_stuffing', 'stuff');
    }

    public function Index()
    {
        $data = [
            'title' => 'Stuffing Plan',
            'conten' => 'stuffing/index',
            'footer_js' => array('assets/js/stuffing.js', 'assets/js/realisasi_stuffing.js')
        ];
        $this->load->view('template/conten', $data);
    }

    // function tableStuffing()
    // {
    //     $data['stuff'] = $this->stuff->get_data_stuffing()->result();
    //     $data['canAdd'] = cek_menu_akses(3,7,1); //modul, menu, akses

    //     echo json_encode($this->load->view('stuffing/stuffing-table', $data, false));
    // }
    function tableStuffing()
    {
        $data['stuff'] = $this->stuff->get_data_stuffing()->result();
        $canAdd = cek_menu_akses(3, 7, 1); // modul, menu, akses
        $html = $this->load->view('stuffing/stuffing-table', $data, true);

        echo json_encode([
            'html' => $html,
            'canAdd' => $canAdd
        ]);
    }


    private function generate_kode_stuf()
    {
        // Ambil ID terbesar saat ini dari tabel
        $last_id = $this->db->select('id') // sesuaikan jika nama kolom bukan 'id'
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get('tbl_stuffing')
            ->row();

        $urutan = 1; // default jika belum ada data
        if ($last_id) {
            $urutan = (int) $last_id->id + 1;
        }

        // Buat format kode
        $tgl = date('dmy'); // format DDMMYY
        $kode = 'STF-' . $tgl . '-' . str_pad($urutan, 6, '0', STR_PAD_LEFT);

        return $kode;
    }

    function v_tambah()
    {
        $data = [
            'title' => 'Create Stuffing Plan',
            'conten' => 'stuffing/tambah-data',
            'kode_stuf' => $this->generate_kode_stuf(),
            'footer_js' => array('assets/js/add_stuffing.js')
        ];
        $this->load->view('template/conten', $data);
    }

    public function update_container()
    {
        $id = $this->input->post('id');
        $no_container = $this->input->post('no_container');
        $no_seal = $this->input->post('no_seal');

        if (!$id) {
            echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan!']);
            return;
        }

        $data = [
            'no_container' => $no_container,
            'no_seal_container' => $no_seal,
        ];

        $this->m_data->update_data('tbl_stuffing', $data, ['id' => $id]);

        echo json_encode(['status' => 'success', 'message' => 'Data container berhasil disimpan!']);
    }


    public function cek_unique_container()
    {
        $no_container = $this->input->post('no_container');
        $no_seal = $this->input->post('no_seal');

        $this->db->select('kd_stuff');
        $this->db->from('tbl_stuffing');
        $this->db->group_start();
        $this->db->where('no_container', $no_container);
        $this->db->or_where('no_seal_container', $no_seal);
        $this->db->group_end();
        $query = $this->db->get();

        if ($query->num_rows() > 0) {
            $row = $query->row();
            $result = [];

            // cek container
            $cekContainer = $this->db->get_where('tbl_stuffing', ['no_container' => $no_container])->row();
            if ($cekContainer) {
                $result[] = [
                    'type' => 'container',
                    'msg' => "No Container sudah ada pada No Stuffing: " . $cekContainer->kd_stuff
                ];
            }

            // cek seal
            $cekSeal = $this->db->get_where('tbl_stuffing', ['no_seal_container' => $no_seal])->row();
            if ($cekSeal) {
                $result[] = [
                    'type' => 'seal',
                    'msg' => "No Seal sudah ada pada No Stuffing: " . $cekSeal->kd_stuff
                ];
            }

            echo json_encode(['status' => 'duplicate', 'data' => $result]);
        } else {
            echo json_encode(['status' => 'ok']);
        }
    }


    // get Buyer List
    public function get_buyer_data()
    {
        $search = $this->input->get('q'); // get keyword dari select2
        $this->load->model('M_acts');
        $result = $this->M_acts->get_buyer_list($search);

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'id' => $row->Kode_Cust,
                'text' => $row->Kode_Cust . ' - ' . $row->Nama_Cust
            ];
        }

        echo json_encode($data);
    }

    // get jenis container
    public function get_data_container()
    {
        $term = $this->input->get('term'); // keyword pencarian dari Select2

        $this->db->like('name', $term);
        $this->db->limit(20); // batasi jumlah hasil
        $query = $this->db->get('tbl_master_container');

        $result = [];
        foreach ($query->result() as $row) {
            $result[] = [
                'id' => $row->id, // sesuaikan kolom ID
                'text' => $row->name, // sesuaikan kolom nama
                'max_volume' => $row->volume,
                'max_weight' => $row->max_gros_weight,
                'max_payload' => $row->max_payload,
            ];
        }

        echo json_encode(['results' => $result]);
    }

    // get no mo 
    public function get_mo_data()
    {
        $this->load->model('M_acts');
        $cari_mo = $this->input->get('q');
        $result = $this->M_acts->get_pi_list($cari_mo);

        $data = [];
        foreach ($result as $row) {
            $nama = $row->No_Cntr;
            $parts = explode(' ', $nama);
            $counter = end($parts);

            $data[] = [
                'id' => $row->No_PI,
                'text' => $row->No_PI,
                'counter' => $counter
            ];
        }

        echo json_encode($data);
    }

    // get barang
    public function get_barang_data()
    {
        $this->load->model('M_acts');

        $search = $this->input->get('q'); // ambil query dari select2
        $result = $this->M_acts->get_barang_list($search);

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'id'   => $row->Kode_Brg,
                'text' => $row->Kode_Brg . ' - ' . $row->Nama_Brg,
                'volume' => $row->Vol,
                'berat_net' => $row->Brt_Net,
                'prod_name' => $row->Nama_Brg,
                'prod_kode' => $row->Kode_Brg,
                'konv' => $row->Konv,
            ];
        }

        echo json_encode($data);
    }

    // get_qty_MO
    public function get_qty_mo()
    {
        $this->load->model('M_acts');

        $no_op    = $this->input->get('no_op');
        $kode_brg = $this->input->get('kode_brg');

        if (!$no_op || !$kode_brg) {
            echo json_encode(['qty_mo' => 0]);
            return;
        }
        $result = $this->M_acts->get_qty_mo($no_op, $kode_brg);

        if ($result) {
            echo json_encode(['qty_mo' => $result->qty_mo]);
        } else {
            echo json_encode(['qty_mo' => 0]);
        }
    }


    // simpan data
    public function save()
    {
        $json = json_decode($this->input->raw_input_stream, true);

        if (!$json) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode([
                    'status'  => 'error',
                    'message' => 'Data kosong'
                ]));
        }

        $header  = $json['header'] ?? [];
        $details = $json['details'] ?? [];
        $tgl_stuffing = date('Y-m-d');

        if (empty($header) || empty($details)) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode([
                    'status'  => 'error',
                    'message' => 'Header atau detail kosong'
                ]));
        }

        // === 1. Simpan ke tbl_stuffing
        $stuffingData = [
            'kd_stuff'          => $header['kd_stuff'],
            'tgl_stuff'         => $tgl_stuffing,
            'trans_type'        => $header['tipe_transportasi'],  // sesuai mapping
            'tipe_container'    => $header['container_truck'],    // sesuai mapping
            'tipe_komo'         => $header['komoditas'],
            'tot_qty_plan'      => $header['total_qty_plan'],
            'tot_qty_real'      => 0,
            'volume'            => $header['total_volume'],
            'volume_real'       => 0,
            'berat'             => $header['total_weight'],
            'berat_real'        => 0,
            'prosen_volume'     => $header['prosen_volume'],
            'prosen_volume_real' => 0,
            'prosen_berat'      => $header['prosen_berat'],
            'prosen_berat_real' => 0,
            'buyer'             => $header['buyer'],
            'keterangan'        => $header['keterangan'],
            'status'            => 1,
            'created_at'        => date('Y-m-d H:i:s'), // waktu server (pastikan set timezone ke WIB)
            'user_create'       => $this->session->userdata('id_user'),
            'tgl_etd'           => $header['tgl_etd'],
            'tgl_eta'           => $header['tgl_eta'],
            'tujuan'           => $header['tujuan'],
            'counter_buyer'     => $header['counter_buyer'],
            'no_container'     => $header['no_container'],
            'no_seal_container' => $header['no_seal_container']
        ];
        $this->db->insert('tbl_stuffing', $stuffingData);
        $stuffing_id = $this->db->insert_id();

        // === 2. Loop simpan detail stuffing
        foreach ($details as $d) {
            $prodKode = $d['prod_kode'] ?? null;
            $prodName = $d['prod_name'] ?? null;

            // Jika prod_name tidak dikirim, coba derive dari prod_text atau cari ke DB
            if (!$prodName) {
                if (!empty($d['prod_text'])) {
                    $parts = explode(' - ', $d['prod_text'], 2);
                    $prodName = isset($parts[1]) ? $parts[1] : $d['prod_text'];
                } elseif (!empty($prodKode)) {
                    $prodName = $this->getBarangName($prodKode); // implementasi di bawah
                } else {
                    $prodName = ''; // fallback terakhir supaya tidak undefined
                }
            }
            $detData = [
                'stuff_id'      => $stuffing_id,
                'mo_id'         => $d['no_so'],
                'prod_kode'     => $d['prod_kode'],  // dari select2 → Kode_Brg
                'prod_name'     => $d['prod_name'],  // dari select2 → Nama_Brg
                'volume'        => $d['volume'],
                'berat_net'     => $d['berat_net'],
                'qty'           => $d['qty'],
                'qty_realisasi' => 0,
                'counter'       => $d['counter'],
                'qty_mo'       => $d['qty_mo'],
                'konv_bndl'       => $d['konv'],
            ];
            $this->db->insert('tbl_det_stuffing', $detData);
            $det_id = $this->db->insert_id();

            // === 3. Jika ada julian → simpan
            if (!empty($d['julian'])) {
                foreach ($d['julian'] as $j) {
                    $julianData = [
                        'det_stuff_id' => $det_id,
                        'no_julian'    => $j['julian'],
                        'line'         => $j['line'],
                        'tahun'        => $j['tahun'],
                        'qty_julian'   => $j['qty'],
                        'date'         => $j['date'],
                        'keterangan'   => $j['keterangan'],
                    ];
                    $this->db->insert('tbl_julian_stuffing', $julianData);
                }
            }
        }

        return $this->output->set_content_type('application/json')
            ->set_output(json_encode([
                'status'  => 'success',
                'message' => 'Data stuffing berhasil disimpan'
            ]));
    }

    private function getBarangName($kode)
    {
        // Sesuaikan dengan model/tabel kamu
        $this->load->model('M_acts');
        $row = $this->M_acts->get_barang_by_kode($kode); // buat method ini di model
        return $row ? $row->Nama_Brg : '';
    }

    public function get_detail_modal($id)
    {
        $header = $this->stuff->get_data_header($id)->row();
        $items = $this->stuff->get_detail_header($id)->result();

        if ($header) {
            echo json_encode([
                'header' => $header,
                'items' => $items
            ]);
        } else {
            echo json_encode(['error' => 'Data tidak ditemukan']);
        }
    }

    // update progress dan approve
    public function update_progress()
    {
        date_default_timezone_set("Asia/Jakarta");
        $id = $this->input->post('id');
        $user_id = $this->session->userdata('id_user'); // pastikan session user_id sudah ada

        $data = [
            'status' => 2,
            'approve_1' => $user_id,
            'date_approve_1' => date('Y-m-d H:i:s') // otomatis waktu server
        ];

        $this->db->where('id', $id);
        $update = $this->db->update('tbl_stuffing', $data);

        if ($update) {
            echo json_encode(['status' => 'success', 'message' => 'Progress berhasil diapprove!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal update data.']);
        }
    }

    // realisasi
    public function get_detail_header_realisasi($id)
    {
        $row = $this->stuff->get_detail_header_realisasi($id);
        echo json_encode($row);
    }

    public function get_detail_barang_realisasi($stuff_id)
    {
        $rows = $this->stuff->get_detail_barang_realisasi($stuff_id);
        echo json_encode($rows);
    }

    public function update_realisasi()
    {

        $id = $this->input->post("idRealisasi"); // id header
        $start_real = $this->input->post('start_real');
        $end_real   = $this->input->post('end_real');

        $header = [
            "tot_qty_real"       => $this->input->post("tot_qty_real"),
            "berat_real"         => $this->input->post("tot_berat_real"),
            "volume_real"        => $this->input->post("tot_vol_real"),
            "prosen_volume_real" => str_replace(" %", "", $this->input->post("prosen_vol_real")),
            "prosen_berat_real"  => str_replace(" %", "", $this->input->post("prosen_berat_real")),
            "status" => 3,
            'start_tgl_realisasi' => date('Y-m-d H:i:s', strtotime($start_real)),
            'end_tgl_realisasi'   => date('Y-m-d H:i:s', strtotime($end_real)),
        ];

        $this->db->trans_start();

        // update header
        $this->stuff->update_header_real($id, $header);

        // update / insert detail
        $detail = $this->input->post("data");

        if (!empty($detail)) {
            foreach ($detail as $row) {
                // jika ada id detail lama, update
                if (!empty($row["id"])) {
                    $this->stuff->update_detail($row["id"], [
                        "qty_realisasi" => $row["qty_realisasi"],
                    ]);
                } else {
                    // insert detail baru
                    $insert = [
                        "stuff_id"      => $id,
                        "mo_id"         => $row["no_so"],
                        "prod_kode"     => $row["kode_barang"],
                        "prod_name"     => $row["nama_barang"],
                        "volume"        => $row["volume"],
                        "berat_net"     => $row["berat_net"],
                        "qty"           => 0,
                        "qty_realisasi" => $row["qty_realisasi"],
                        "counter"       => $row["no_counter"],
                    ];
                    $this->stuff->insert_detail($insert);
                }
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            echo json_encode(["status" => "error", "message" => "Gagal update realisasi"]);
        } else {
            echo json_encode(["status" => "success", "message" => "Realisasi berhasil diupdate"]);
        }
    }

    public function reject_realisasi()
    {
        $id = $this->input->post("id");
        $reason = $this->input->post("reason");

        if (!$id || !$reason) {
            echo json_encode([
                "status" => "error",
                "message" => "ID dan keterangan reject wajib diisi!"
            ]);
            return;
        }

        $data = [
            "status" => 7,         // status = 7 → rejected
            "ket_rejec" => $reason,   // simpan alasan reject
            "tgl_reject" => date("Y-m-d H:i:s")
        ];

        $this->db->where("id", $id)->update("tbl_stuffing", $data);

        if ($this->db->affected_rows() > 0) {
            echo json_encode([
                "status" => "success",
                "message" => "Realisasi berhasil direject"
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Gagal reject realisasi atau tidak ada perubahan data"
            ]);
        }
    }

    public function reopen()
    {
        $id = $this->input->post("id");

        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID tidak valid"]);
            return;
        }

        $update = ["status" => 2]; // status dibuka kembali

        $this->db->where("id", $id)->update("tbl_stuffing", $update);

        if ($this->db->affected_rows() > 0) {
            echo json_encode(["status" => "success", "message" => "Data berhasil di Re-Open"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Data gagal di Re-Open"]);
        }
    }

    public function cancel_data()
    {
        $id = $this->input->post("id");

        $this->db->where("id", $id);
        $update = $this->db->update("tbl_stuffing", ["status" => 6]);

        if ($update) {
            echo json_encode(["status" => "success", "message" => "Data berhasil di-Cancel"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal cancel data"]);
        }
    }

    // approve final
    public function update_status()
    {
        $id     = $this->input->post("id");
        $status = $this->input->post("status");

        $this->db->where("id", $id)->update("tbl_stuffing", [
            "status" => $status
        ]);

        if ($this->db->affected_rows() > 0) {
            echo json_encode(["status" => "success", "message" => "Status berhasil diperbarui"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Status gagal diperbarui"]);
        }
    }

    public function reset_status($id)
    {
        // Mulai transaksi biar aman
        $this->db->trans_start();

        // 🔹 Update status header stuffing ke Draft
        $this->db->where('id', $id);
        $this->db->update('tbl_stuffing', ['status' => 1]);

        // 🔹 Update semua detail terkait (reset qty_realisasi)
        $this->db->where('stuff_id', $id);
        $this->db->update('tbl_det_stuffing', ['qty_realisasi' => 0]); // bisa ganti null kalau kamu mau

        // 🔹 Selesaikan transaksi
        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            echo json_encode([
                'status'  => 'error',
                'message' => 'Gagal mereset status dan data detail'
            ]);
        } else {
            echo json_encode([
                'status'  => 'success',
                'message' => 'Status berhasil direset ke Draft dan qty realisasi direset'
            ]);
        }
    }


    public function get_detail_stuff($stuff_id)
    {
        $data = $this->db->get_where('tbl_det_stuffing', ['stuff_id' => $stuff_id])->result();
        echo json_encode($data);
    }



    // edit data
    public function v_edit($id = null)
    {
        $id = (int) $id;
        if (!$id) {
            show_error('ID tidak valid', 400);
            return;
        }

        // 🔹 Ambil data header + join container
        $this->db->select('s.*, c.name as container_name, c.volume as max_volume, c.max_payload');
        $this->db->from('tbl_stuffing s');
        $this->db->join('tbl_master_container c', 'c.id = s.tipe_container', 'left');
        $this->db->where('s.id', $id);
        $header = $this->db->get()->row();

        // Detail stuffing
        $detail = $this->db->get_where('tbl_det_stuffing', ['stuff_id' => $id])->result();

        foreach ($detail as $d) {
            $d->julian = $this->db->get_where('tbl_julian_stuffing', [
                'det_stuff_id' => $d->id
            ])->result();
        }

        $data = [
            'title'     => 'Edit Stuffing Plan',
            'conten'    => 'stuffing/edit-data', // view khusus edit
            'id_stuff'  => $id, // untuk kirim ID ke view
            'header'    => $header, // 🔹 sekarang sudah ada data container juga
            'detail'    => $detail,
            'detail_json' => json_encode($detail),
            'footer_js' => array('assets/js/edit_stuffing.js') // file JS untuk edit
        ];

        $this->load->view('template/conten', $data);
    }

    public function get_julian_data($det_id)
    {
        $data = $this->db->get_where('tbl_julian_stuffing', ['det_stuff_id' => $det_id])->result();
        echo json_encode($data);
    }

    // update data
    public function update()
    {
        $json = json_decode($this->input->raw_input_stream, true);

        if (!$json) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode([
                    'status'  => 'error',
                    'message' => 'Data kosong'
                ]));
        }

        $header  = $json['header'] ?? [];
        $details = $json['details'] ?? [];

        if (empty($header) || empty($details)) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode([
                    'status'  => 'error',
                    'message' => 'Header atau detail kosong'
                ]));
        }

        $this->db->trans_start();

        // === 1. Update header stuffing ===
        $stuffing_id = $header['id']; // pastikan hidden input id ada di form edit
        $stuffingData = [
            'kd_stuff'          => $header['kd_stuff'],
            'tgl_stuff'         => $header['edit_tgl_stuff'],
            'trans_type'        => $header['edit_tipe_transportasi'],
            'tipe_container'    => $header['edit_container_truck'],
            'tipe_komo'         => $header['edit_komoditas'],
            'tot_qty_plan'      => $header['edit_total_qty_plan'],
            'volume'            => $header['edit_total_volume'],
            'berat'             => $header['edit_total_weight'],
            'prosen_volume'     => $header['prosen_volume'],
            'prosen_berat'      => $header['prosen_berat'],
            'buyer'             => $header['edit_buyer'],
            'keterangan'        => $header['keterangan'],
            'updated_at'        => date('Y-m-d H:i:s'),
            'tgl_etd'        => $header['edit_tgl_etd'],
            'tgl_eta'        => $header['edit_tgl_eta'],
            'tujuan'        => $header['edit_tujuan'],
            'counter_buyer'        => $header['edit_counter_buyer'],
        ];
        $this->db->where('id', $stuffing_id)->update('tbl_stuffing', $stuffingData);

        // === 2. Update/Insert detail + julian ===
        foreach ($details as $d) {
            $prodKode = $d['prod_kode'] ?? null;
            $prodName = $d['prod_name'] ?? null;

            if (!$prodName) {
                if (!empty($d['prod_text'])) {
                    $parts = explode(' - ', $d['prod_text'], 2);
                    $prodName = isset($parts[1]) ? $parts[1] : $d['prod_text'];
                } elseif (!empty($prodKode)) {
                    $prodName = $this->getBarangName($prodKode);
                } else {
                    $prodName = '';
                }
            }

            // Cek apakah detail lama atau baru
            if (!empty($d['id'])) {
                // Update detail lama
                $det_id = $d['id'];
                $this->db->where('id', $det_id)->update('tbl_det_stuffing', [
                    'mo_id'         => $d['no_so'],
                    'prod_kode'     => $prodKode,
                    'prod_name'     => $prodName,
                    'volume'        => $d['volume'],
                    'berat_net'     => $d['berat_net'],
                    'qty'           => $d['qty'],
                    'counter'       => $d['counter'],
                    'qty_mo'        => $d['qty_mo'],
                    'konv_bndl'     => $d['konv']
                ]);
            } else {
                // Insert detail baru
                $this->db->insert('tbl_det_stuffing', [
                    'stuff_id'      => $stuffing_id,
                    'mo_id'         => $d['no_so'],
                    'prod_kode'     => $prodKode,
                    'prod_name'     => $prodName,
                    'volume'        => $d['volume'],
                    'berat_net'     => $d['berat_net'],
                    'qty'           => $d['qty'],
                    'counter'       => $d['counter'],
                    'qty_mo'        => $d['qty_mo'],
                ]);
                $det_id = $this->db->insert_id();
            }

            // === 3. Update/insert julian ===
            if (array_key_exists('julian', $d)) {
                // Hanya hapus & insert ulang jika ada key 'julian'
                // $this->db->where('det_stuff_id', $det_id)->delete('tbl_julian_stuffing');

                if (!empty($d['julian'])) {
                    foreach ($d['julian'] as $j) {
                        $julianData = [
                            'det_stuff_id' => $det_id,
                            'no_julian'    => $j['julian'],
                            'line'         => $j['line'],
                            'tahun'        => $j['tahun'],
                            'qty_julian'   => $j['qty'],
                            'date'         => $j['date'],
                            'keterangan'   => $j['keterangan'],
                        ];
                        $this->db->insert('tbl_julian_stuffing', $julianData);
                    }
                }
            }
        }

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode([
                    'status'  => 'error',
                    'message' => 'Gagal update data'
                ]));
        }

        return $this->output->set_content_type('application/json')
            ->set_output(json_encode([
                'status'  => 'success',
                'message' => 'Data stuffing berhasil diupdate'
            ]));
    }

    public function cetak_breakdown($id)
    {
        // Ambil data berdasarkan ID stuffing yang dikirim dari URL
        $data['get_data'] = $this->stuff->data_breakdown($id)->result();

        // Load view ke dalam variabel HTML
        $html = $this->load->view('stuffing/print_breakdown', $data, true);

        // Load library PDF dan atur orientasi
        $this->load->library('Pdf');
        $pdf = $this->pdf->load(['orientation' => 'L']); // L = Landscape, P = Portrait

        // Tulis HTML ke PDF
        $pdf->WriteHTML($html);

        // Output PDF ke browser
        $pdf->Output("breakdown_$id.pdf", "I");
        // Opsi "I" = tampil di browser, "D" = download, "F" = simpan ke file
    }

    public function cetak_breakdown_exim($id)
    {
        //  $this->load->library('Pdf');
        // $mpdf = $this->pdf->load(['orientation' => 'L']);
        // $mpdf->WriteHTML('<h1>Halo Dunia</h1>');
        // $mpdf->Output();
        // Ambil data berdasarkan ID stuffing yang dikirim dari URL
        $data['header'] = $this->stuff->data_breakdown_exim($id)->result();
        $data['detail'] = $this->stuff->detail_data_breakdown_exim($id)->result();

        // Load view ke dalam variabel HTML
        $html = $this->load->view('stuffing/print_breakdown_exim', $data, true);

        // Load library PDF dan atur orientasi
        $this->load->library('Pdf');
        $pdf = $this->pdf->load(['orientation' => 'L']); // L = Landscape, P = Portrait

        // Tulis HTML ke PDF
        $pdf->WriteHTML($html);

        // Output PDF ke browser
        $pdf->Output("breakdown_$id.pdf", "I");
        // Opsi "I" = tampil di browser, "D" = download, "F" = simpan ke file
    }
}
