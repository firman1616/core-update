<?php
class M_acts extends CI_Model
{
    function __construct()
    {
        parent::__construct();

        $this->db_acts = $this->load->database('acts', TRUE);
    }

    public function get_one_supplier()
    {
        // Ambil 1 data dari tb_m_supp
        $query = $this->db_acts->get('tb_m_supp', 1);
        return $query->result(); // return 1 baris sebagai object
    }

    public function get_mo_list($search = null)
    {
        $this->db_acts = $this->load->database('acts', TRUE);
        $this->db_acts->select('No_OP, Nama_Pemesan');
        $this->db_acts->from('tb_mt_op');

        if (!empty($search)) {
            $this->db_acts->like('No_OP', $search);
        }

        $query = $this->db_acts->get();
        return $query->result();
    }

    public function get_pi_list($search = null)
    {
        $this->db_acts = $this->load->database('acts', TRUE);
        $this->db_acts->select('No_PI, No_Cntr');
        $this->db_acts->from('tb_mt_pi');

        if (!empty($search)) {
            $this->db_acts->like('No_PI', $search);
        }

        $query = $this->db_acts->get();
        return $query->result();
    }

    public function get_buyer_list($search = null)
    {
        $this->db_acts = $this->load->database('acts', TRUE);
        $this->db_acts->select('Kode_Cust, Nama_Cust');
        $this->db_acts->from('tb_m_cust');

        if (!empty($search)) {
            $this->db_acts->like('Kode_Cust', $search);
            $this->db_acts->or_like('Nama_Cust', $search);
        }

        $query = $this->db_acts->get();
        return $query->result();
    }

    // public function get_barang_list($search = null)
    // {
    //     $this->db_acts = $this->load->database('acts', TRUE);
    //     $this->db_acts->select('Kode_Brg, Nama_Brg, Vol, Brt_Net');
    //     $this->db_acts->from('tb_m_brg'); // ganti dengan nama tabel aslinya

    //     if (!empty($search)) {
    //         $this->db_acts->group_start();
    //         $this->db_acts->like('Kode_Brg', $search);
    //         $this->db_acts->or_like('Nama_Brg', $search);
    //         $this->db_acts->group_end();
    //     }

    //     $this->db_acts->limit(20); // biar tidak terlalu berat
    //     $query = $this->db_acts->get();
    //     return $query->result();
    // }

    public function get_barang_list($search = null)
    {
        $this->db_acts = $this->load->database('acts', TRUE);

        $this->db_acts->select('
        tmb.Kode_Brg,
        tmb.Nama_Brg,
        tmb.Vol,
        tmb.Brt_Net,
        tdbks.Konv,
        tms.Kode_Sat
    ');
        $this->db_acts->from('tb_m_brg tmb');
        $this->db_acts->join(
            'tb_d_brg_konv_sat tdbks',
            "tdbks.UCode_Brg = tmb.UCode_Brg AND tdbks.UCode_Sat_Lain = '11020000000042'",
            'left'
        );
        $this->db_acts->join('tb_m_sat tms', 'tms.UCode_Sat = tdbks.UCode_Sat_Lain', 'left');

        // Tambahkan pencarian jika ada input search
        if (!empty($search)) {
            $this->db_acts->group_start();
            $this->db_acts->like('tmb.Kode_Brg', $search);
            $this->db_acts->or_like('tmb.Nama_Brg', $search);
            $this->db_acts->group_end();
        }

        // Limit supaya query tidak berat
        $this->db_acts->limit(20);

        $query = $this->db_acts->get();
        return $query->result();
    }


    public function get_qty_mo($no_op, $kode_brg)
    {
        // pakai koneksi database "acts"
        $this->db_acts = $this->load->database('acts', TRUE);

        $this->db_acts->select('tdpb.Qty_Std as qty_mo');
        $this->db_acts->from('tb_mt_pi tmp');
        $this->db_acts->join('tb_dt_pi_brg tdpb', 'tdpb.UCode_PI = tmp.UCode_PI');
        $this->db_acts->join('tb_m_brg tmb', 'tmb.UCode_Brg = tdpb.UCode_Brg');
        $this->db_acts->where('tmp.No_PI', $no_op);
        $this->db_acts->where('tmb.Kode_Brg', $kode_brg);
        $this->db_acts->limit(1);

        $query = $this->db_acts->get();
        return $query->row();
    }




    // function get_data_barang()
    // {
    //     $this->db_acts = $this->load->database('acts', TRUE);
    //     return $this->db_acts->query("SELECT
    //         tmb.Kode_Brg,
    //         tmb.Nama_Brg,
    //         tmb.Pjg,
    //         tmb.Lbr,
    //         tmb.Tgi,
    //         tmb.Vol,
    //         tmb.Brt_Net
    //     from
    //         tb_m_brg tmb
    //     where
    //         tmb.UCode_Grp_Brg in ('11040000000052', '11040000000054')
    //         and tmb.tahun = '2025'");
    // }
    private function _get_datatables_query_barang()
    {
        $this->db_acts->from('tb_m_brg'); // ganti ke tb_m_brg (bukan tbl_barang)
        $this->column_search = ['Kode_Brg', 'Nama_Brg'];
        $this->column_order  = [null, 'Kode_Brg', 'Nama_Brg', 'Pjg', 'Lbr', 'Tgi', 'Vol', 'Brt_Net'];
        $this->order         = ['Kode_Brg' => 'asc'];

        $this->db_acts->where_in('UCode_Grp_Brg', [
            '11040000000052',
            '11040000000054'
        ]);

        $i = 0;
        foreach ($this->column_search as $item) {
            if ($_POST['search']['value']) {
                if ($i === 0) {
                    $this->db_acts->group_start();
                    $this->db_acts->like($item, $_POST['search']['value']);
                } else {
                    $this->db_acts->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db_acts->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db_acts->order_by(
                $this->column_order[$_POST['order'][0]['column']],
                $_POST['order'][0]['dir']
            );
        } elseif (isset($this->order)) {
            $this->db_acts->order_by(key($this->order), $this->order[key($this->order)]);
        }
    }

    public function get_datatables_barang()
    {
        $this->_get_datatables_query_barang();
        if ($_POST['length'] != -1)
            $this->db_acts->limit($_POST['length'], $_POST['start']);
        return $this->db_acts->get()->result();
    }

    public function count_filtered_barang()
    {
        $this->_get_datatables_query_barang();
        return $this->db_acts->get()->num_rows();
    }

    public function count_all_barang()
    {
        $this->db_acts->from('tb_m_brg');
        return $this->db_acts->count_all_results();
    }

    public function get_barang_by_kode($kode)
    {
        return $this->db_acts->select('Kode_Brg, Nama_Brg, Vol, Brt_Net')
            ->from('tb_m_brg')   // sesuaikan dengan nama tabel barang sebenarnya
            ->where('Kode_Brg', $kode)
            ->get()
            ->row();
    }
}
