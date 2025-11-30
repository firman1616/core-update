<?php
class M_stuffing extends CI_Model
{
  function __construct()
  {
    parent::__construct();
  }

  function get_data_stuffing()
  {
    return $this->db->query("SELECT
      ts.id,
      ts.kd_stuff,
      ts.tgl_stuff,
      ts.tot_qty_plan,
      ts.tot_qty_real,
      ts.buyer,
      ts.counter_buyer,
      ts.volume,
      ts.ket_rejec,
      ts2.id as id_status,
      ts2.name as status,
      ts.prosen_volume
    from
      tbl_stuffing ts
    join tbl_status ts2 on ts2.id = ts.status");
  }

  function get_data_header($id)
  {
    return $this->db->query("SELECT
            ts.id,
            ts.kd_stuff,
            ts.tgl_stuff,
            CASE 
                WHEN ts.trans_type = 1 THEN 'Container'
                WHEN ts.trans_type = 2 THEN 'Truck'
                ELSE '-'
            END AS trans_type,
            CASE 
                WHEN ts.tipe_komo = 1 THEN 'Non Komoditi'
                WHEN ts.tipe_komo = 2 THEN 'Komoditi'
                ELSE '-'
            END AS tipe_komo,
            ts.tot_qty_plan,
            ts.tot_qty_real,
            ts.volume,
            ts.volume_real,
            ts.berat,
            ts.berat_real,
            ts.prosen_volume,
            ts.prosen_volume_real,
            ts.prosen_berat,
            ts.prosen_berat_real,
            ts.keterangan,
            ts.buyer,
            tmc.name as container,
            ts.no_container,
            ts.no_seal_container,
            ts.tujuan,
            ts.counter_buyer
        FROM
            tbl_stuffing ts
        join tbl_master_container tmc on tmc.id = ts.tipe_container
        where ts.id = $id");
  }

  function get_detail_header($id)
  {
    return $this->db->query("SELECT
        ts.id,
        tds.mo_id,
        tds.counter,
        tds.prod_kode,
        tds.prod_name,
        tds.qty,
        tds.qty_realisasi,
        tjs.no_julian,
        tjs.line,
        tjs.tahun,
        tjs.qty_julian,
        tjs.date,
        tjs.keterangan 
    FROM
        tbl_stuffing ts
    join tbl_det_stuffing tds on tds.stuff_id = ts.id
    join tbl_julian_stuffing tjs on tjs.det_stuff_id = tds.id
    where ts.id = $id");
  }

  public function get_detail_header_realisasi($id)
  {
    return $this->db->select('
                ts.id,
                ts.kd_stuff,
                ts.tgl_stuff,
                ts.tot_qty_plan,
                ts.tot_qty_real,
                ts.volume,
                ts.volume_real,
                ts.prosen_volume,
                ts.prosen_volume_real,
                ts.prosen_berat,
                ts.prosen_berat_real,
                ts.berat,
                ts.berat_real,
                tmc.volume as volume_container,
                tmc.max_payload as maxPayload
            ')
      ->from('tbl_stuffing ts')
      ->join('tbl_master_container tmc', 'tmc.id = ts.tipe_container', 'left')
      ->where('ts.id', $id)
      ->get()
      ->row();
  }


  public function get_detail_barang_realisasi($stuff_id)
  {
    return $this->db->select('
            tds.id,
            tds.stuff_id,
            tds.mo_id,
            tds.counter,
            tds.prod_kode,
            tds.prod_name,
            tds.qty,
            tds.qty_realisasi,
            tds.volume,
            tds.berat_net
        ')
      ->from('tbl_det_stuffing tds')
      ->where('tds.stuff_id', $stuff_id)
      ->get()
      ->result();
  }

  public function update_header_real($id, $data)
  {
    return $this->db->where("id", $id)->update("tbl_stuffing", $data);
  }

  // public function update_detail($id, $data)
  // {
  //   return $this->db->where("id", $id)->update("tbl_det_stuffing", $data);
  // }

  // public function insert_detail($data)
  // {
  //   return $this->db->insert("tbl_det_stuffing", $data);
  // }

  function data_breakdown($id)
  {
    return $this->db->query("SELECT
      ts.id,
      ts.kd_stuff,
      ts.tgl_stuff,
      ts.tgl_etd,
      ts.tgl_eta,
      ts.buyer,
      tds.mo_id,
      tds.prod_kode,
      tds.prod_name,
      tds.qty as qty_plan,
      tds.qty_mo,
      tds.qty_realisasi,
      tds.counter,
      tjs.no_julian,
      tjs.line,
      tjs.tahun,
      tjs.qty_julian,
      tjs.date,
      tjs.keterangan
    from
      tbl_stuffing ts 
    join tbl_det_stuffing tds on tds.stuff_id = ts.id
    join tbl_julian_stuffing tjs on tjs.det_stuff_id = tds.id
    where ts.id = '$id'");
  }

  function data_breakdown_exim($id)
  {
    return $this->db->query("SELECT
      ts.id,
      ts.kd_stuff,
      ts.tgl_stuff,
      ts.buyer,
      ts.tgl_etd,
      ts.tgl_eta,
      ts.tujuan,
      ts.tipe_container,
      tmc.name as tipe_container,
      ts.counter_buyer
    from
      tbl_stuffing ts
    join tbl_master_container tmc on tmc.id = ts.tipe_container
    where ts.id = '$id'");
  }

  function detail_data_breakdown_exim($id)
  {
    return $this->db->query("SELECT
      tds.stuff_id,
      tds.mo_id,
      tds.prod_kode,
      tds.prod_name,
      tds.qty_mo,
      tds.counter,
      tds.konv_bndl,
      tds.qty as qty_plan,
      tds.qty_realisasi
    from
      tbl_det_stuffing tds
    where tds.stuff_id = '$id'");
  }

  public function update_header($data)
  {
    // Pastikan ada ID
    if (!isset($data['id'])) {
      throw new Exception("ID header tidak ditemukan.");
    }

    $id = $data['id'];
    unset($data['id']);

    // Mapping form field → nama kolom tabel
    $mapping = [
      'kd_stuff'          => 'kd_stuff',
      // 'tgl_stuff'         => 'tgl_stuff',
      'tipe_transportasi' => 'trans_type',
      'container'         => 'tipe_container',
      'komoditas'         => 'tipe_komo',
      'total_qty_plan'    => 'tot_qty_plan',
      'total_volume'      => 'volume',
      'total_weight'      => 'berat',
      'prosen_volume'     => 'prosen_volume',
      'prosen_berat'      => 'prosen_berat',
      'counter_buyer'     => 'counter_buyer',
      'buyer'             => 'buyer',
      'keterangan'        => 'keterangan',
      'tgl_etd'           => 'tgl_etd',
      'tgl_eta'           => 'tgl_eta',
      'tujuan'            => 'tujuan',
      'no_container'      => 'no_container',
      'no_seal_container' => 'no_seal_container',
    ];

    // Buat array baru hanya dengan kolom tabel yang benar
    $updateData = [];
    foreach ($mapping as $formKey => $dbKey) {
      if (isset($data[$formKey])) {
        $updateData[$dbKey] = $data[$formKey];
      }
    }

    // Tambahkan kolom updated_at
    $updateData['updated_at'] = date('Y-m-d H:i:s');

    // Eksekusi update
    return $this->db->where('id', $id)->update('tbl_stuffing', $updateData);
  }

  public function update_detail($id, $data)
  {
    unset($data['id'], $data['julian']);
    return $this->db->where('id', $id)->update('tbl_det_stuffing', $data);
  }

  public function insert_detail($data)
  {
    unset($data['id'], $data['julian']);
    $this->db->insert('tbl_det_stuffing', $data);
    return $this->db->insert_id();
  }

  public function update_julian($data)
  {
    if (!isset($data['id'])) {
      throw new Exception("ID Julian tidak ditemukan.");
    }

    $id = $data['id'];
    unset($data['id']);

    // ✅ mapping field form ke kolom database yang benar
    $mapping = [
      'det_stuff_id' => 'det_stuff_id',
      'no_julian'    => 'no_julian',
      'line'         => 'line',
      'tahun'        => 'tahun',
      'qty_julian'   => 'qty_julian',
      'date'         => 'date',
      'keterangan'   => 'keterangan',
    ];

    $updateData = [];
    foreach ($mapping as $formKey => $dbKey) {
      if (isset($data[$formKey])) {
        $updateData[$dbKey] = $data[$formKey];
      }
    }

    return $this->db->where('id', $id)->update('tbl_julian_stuffing', $updateData);
  }


  public function insert_julian($data)
  {
    unset($data['id']);
    $this->db->insert('tbl_julian_stuffing', $data);
    return $this->db->insert_id();
  }

  // fungsi get report
  public function get_report($start_date = null, $end_date = null, $buyer = null, $counter_buyer = null)
  {
    $this->db->from('tbl_stuffing');

    if ($start_date && $end_date) {
      $this->db->where('tgl_stuff >=', $start_date);
      $this->db->where('tgl_stuff <=', $end_date);
    }

    if (!empty($buyer)) {
      $this->db->like('LOWER(buyer)', strtolower($buyer), 'both');
    }

    if (!empty($counter_buyer)) {
      $this->db->like('LOWER(counter_buyer)', strtolower($counter_buyer), 'both');
    }

    return $this->db->get();
  }

  public function get_report_by_etd($start_date = null, $end_date = null, $buyer = null, $counter_buyer = null)
  {
    $this->db->from('tbl_stuffing');

    if ($start_date && $end_date) {
      $this->db->where('tgl_etd >=', $start_date);
      $this->db->where('tgl_etd <=', $end_date);
    }

    if (!empty($buyer)) {
      $this->db->like('LOWER(buyer)', strtolower($buyer), 'both');
    }

    if (!empty($counter_buyer)) {
      $this->db->like('LOWER(counter_buyer)', strtolower($counter_buyer), 'both');
    }

    return $this->db->get();
  }
}
