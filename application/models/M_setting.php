<?php
class M_setting extends CI_Model
{
  function __construct()
  {
    parent::__construct();
  }
  
  function get_data_menu() {
    return $this->db->query("SELECT
      tm.id,
      tm.name as menu,
      tm.url,
      tm.modul_id,
      tm2.name as modul
    from
      tbl_menu tm
    join tbl_modul tm2 on tm2.id = tm.modul_id 
    order by id asc ");
  }
}