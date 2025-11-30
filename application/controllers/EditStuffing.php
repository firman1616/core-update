<?php
defined('BASEPATH') or exit('No direct script access allowed');

class EditStuffing extends CI_Controller
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

        // 🔹 Ambil detail stuffing
        $detail = $this->db->get_where('tbl_det_stuffing', ['stuff_id' => $id])->result();

        // 🔹 Tambahkan julian di setiap detail
        foreach ($detail as $d) {
            $d->julian = $this->db->get_where('tbl_julian_stuffing', [
                'det_stuff_id' => $d->id
            ])->result();
        }

        // 🔹 Gabungkan semua data ke dalam 1 array JSON
        $stuffing_data = [
            'header' => $header,
            'detail' => $detail
        ];

        // 🔹 Siapkan data untuk dikirim ke view
        $data = [
            'title'       => 'Edit Stuffing Plan',
            'conten'      => 'stuffing/edit-data',
            'id_stuff'    => $id,
            'data_json'   => json_encode($stuffing_data), // semua data dalam 1 variabel
            'footer_js'   => ['assets/js/edit_stuffing.js']
        ];

        $this->load->view('template/conten', $data);
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

    // reload julian table
    public function get_julian_by_detail($det_id)
    {
        $data = $this->db
            ->where('det_stuff_id', $det_id)
            ->get('tbl_julian_stuffing')
            ->result();

        echo json_encode(['status' => 'success', 'data' => $data]);
    }


    // fungsi delete julian
    public function delete_julian($id)
    {
        $this->db->where('id', $id);
        $this->db->delete('tbl_julian_stuffing');
        echo json_encode(['status' => 'deleted']);
    }

    // fungsi simpan julian
    public function save_julian()
    {
        $post = $this->input->post();
        $items = json_decode($post['items'] ?? '[]', true);
        $det_id = $post['det_id'] ?? null;

        if (empty($det_id) || empty($items)) {
            echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
            return;
        }

        foreach ($items as $item) {
            // Validasi minimal
            if (empty($item['no_julian']) || empty($item['line'])) {
                continue;
            }

            $data = [
                'det_stuff_id' => $item['det_stuff_id'] ?? $det_id,
                'no_julian'    => $item['no_julian'] ?? null,
                'line'         => $item['line'] ?? null,
                'tahun'        => $item['tahun'] ?? null,
                'qty_julian'   => $item['qty_julian'] ?? null,
                'date'         => $item['date'] ?? null,
                'keterangan'   => $item['keterangan'] ?? null,
            ];

            // Cek apakah sudah ada data julian dengan kombinasi yang sama
            $exists = $this->db->get_where('tbl_julian_stuffing', [
                'det_stuff_id' => $data['det_stuff_id'],
                'no_julian'    => $data['no_julian'],
                'line'         => $data['line']
            ])->row();

            if ($exists) {
                // Update jika sudah ada
                $this->db->where('id', $exists->id)->update('tbl_julian_stuffing', $data);
            } else {
                // Insert baru
                $this->db->insert('tbl_julian_stuffing', $data);
            }
        }

        echo json_encode(['status' => 'success']);
    }

    // delete detail dan julian
    public function delete_detail()
    {
        $det_id = $this->input->post('det_id');

        if (empty($det_id)) {
            echo json_encode(['status' => 'error', 'message' => 'ID detail tidak ditemukan']);
            return;
        }

        $this->db->trans_start();

        // 🔹 Hapus semua Julian yang terkait
        $this->db->where('det_stuff_id', $det_id);
        $this->db->delete('tbl_julian_stuffing');

        // 🔹 Hapus detail stuffing
        $this->db->where('id', $det_id);
        $this->db->delete('tbl_det_stuffing');

        $this->db->trans_complete();

        if ($this->db->trans_status() === FALSE) {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus data.']);
        } else {
            echo json_encode(['status' => 'success']);
        }
    }

    // final update
    public function update()
    {
        $json = json_decode($this->input->raw_input_stream, true);

        if (!$json || empty($json['header'])) {
            return $this->output->set_content_type('application/json')
                ->set_output(json_encode(['status' => 'error', 'message' => 'Data kosong']));
        }

        $header = $json['header'];
        $details = $json['details'] ?? [];

        $this->db->trans_begin();

        try {
            // Update header
            $this->stuff->update_header($header);

            foreach ($details as $det) {
                // 🔹 Cek apakah ID valid numeric atau ID sementara seperti 'temp_3'
                if (!empty($det['id']) && is_numeric($det['id'])) {
                    // Update detail lama
                    $this->stuff->update_detail($det['id'], $det);
                } else {
                    // Insert detail baru
                    $det['stuff_id'] = $header['id'];
                    $newDetailId = $this->stuff->insert_detail($det);
                    $det['id'] = $newDetailId; // pakai ID baru
                }

                // Proses Julian
                if (!empty($det['julian'])) {
                    foreach ($det['julian'] as $jul) {
                        if (!empty($jul['id']) && is_numeric($jul['id'])) {
                            // ✅ Update Julian jika ID numeric
                            $this->stuff->update_julian($jul);
                        } else {
                            // ✅ Jika ID masih temp / baru
                            $jul['det_stuff_id'] = $det['id'];
                            $this->stuff->insert_julian($jul);
                        }
                    }
                }
            }

            if ($this->db->trans_status() === FALSE) {
                throw new Exception("Transaksi gagal, silakan ulangi.");
            }

            $this->db->trans_commit();
            $response = [
                'status' => 'success',
                'message' => 'Data berhasil diperbarui.'
            ];
        } catch (Exception $e) {
            $this->db->trans_rollback();
            $response = ['status' => 'error', 'message' => $e->getMessage()];
        }

        return $this->output->set_content_type('application/json')->set_output(json_encode($response));
    }
}
