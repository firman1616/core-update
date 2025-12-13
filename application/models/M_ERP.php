<?php
class M_ERP extends CI_Model
{
  protected $db_odoo;

  public function __construct()
  {
    parent::__construct();
    // Load sekali saja
    $this->db_odoo = $this->load->database('odoo', TRUE);
  }

  public function get_customer_odoo($search = null)
  {
    // $db_odoo = $this->load->database('odoo', TRUE);

    $this->db_odoo->select('id, name');
    $this->db_odoo->from('res_partner');
    $this->db_odoo->where('customer', TRUE);
    $this->db_odoo->where('active', TRUE);

    if (!empty($search)) {
      $search = $this->db_odoo->escape_like_str($search);
      $this->db_odoo->where("name ILIKE '%{$search}%'", null, false);
    }

    $this->db_odoo->order_by('name', 'ASC');
    $this->db_odoo->limit(20);

    return $this->db_odoo->get()->result_array();
  }

  public function get_product_type_precost($search = null)
  {
    $this->db_odoo->select('id, name');
    $this->db_odoo->from('x_product_type_precost');

    if (!empty($search)) {
      $search = $this->db_odoo->escape_like_str($search);
      $this->db_odoo->where("name ILIKE '%{$search}%'", null, false);
    }

    $this->db_odoo->order_by('name', 'ASC');
    $this->db_odoo->limit(20);

    return $this->db_odoo->get()->result_array();
  }
}
