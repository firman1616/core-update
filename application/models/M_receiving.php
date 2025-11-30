<?php
class M_receiving extends CI_Model
{
  function __construct()
  {
    parent::__construct();
  }
  function get_data($table)
  {
    return $this->db->get($table);
  }

  public function insert_receiving($data)
    {
        return $this->db->insert('receiving', $data);
    }
}