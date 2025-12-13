<?php defined('BASEPATH') OR exit('No direct script access allowed');

class M_df extends CI_Model
{
    public function generate_kode_df()
    {
        $tahun = date('y'); // YY
        $bulan = date('m'); // MM
        $prefix = "DF-{$tahun}{$bulan}-";

        $sql = "
            SELECT kd_df
            FROM tbl_data_form
            WHERE kd_df LIKE ?
            ORDER BY kd_df DESC
            LIMIT 1
        ";

        $query = $this->db->query($sql, [$prefix . '%']);

        if ($query->num_rows() > 0) {
            $last_code = $query->row()->kd_df;
            $last_number = (int) substr($last_code, -4);
            $new_number = $last_number + 1;
        } else {
            $new_number = 1;
        }

        return $prefix . str_pad($new_number, 4, '0', STR_PAD_LEFT);
    }
}
