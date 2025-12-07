<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Migrate3 extends CI_Migration
{

    public function up()
    {
        // Buat tabel users untuk PostgreSQL
        $this->dbforge->add_field([
            'id' => [
                'type' => 'SERIAL', // PostgreSQL auto increment
                'unsigned' => TRUE
            ],
            'kd_df' => [
                'type' => 'VARCHAR',
                'constraint' => '150',
                'null' => FALSE
            ],
            'tgl_df' => [
                'type' => 'date',
                // 'constraint' => '150',
                'null' => FALSE
            ],
            'no_sq' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'qty' => [
                'type' => 'numeric',
                'null' => TRUE
            ],
            'sales' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'item_name' => [
                'type' => 'VARCHAR',
                'constraint' => '200',
                'null' => TRUE
            ],
            'cus_name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => TRUE
            ],
            'prod_kateg' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'print_side' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'print_side_face' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'media_tempel' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'panjang' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => TRUE
            ],
            'lebar' => [
                'type' => 'DECIMAL',
                'constraint' => '10,2',
                'null' => TRUE
            ],
            'diecute_shape' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'other' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'material' => [
                'type' => 'VARCHAR',
                'constraint' => '200',
                'null' => TRUE
            ],
            'release' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
            'packing_layout' => [
                'type' => 'VARCHAR',
                'constraint' => '50',
                'null' => TRUE
            ],
        ]);

        $this->dbforge->add_key('id', TRUE); // Primary key
        $this->dbforge->add_field("created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        $this->dbforge->create_table('tbl_data_form', TRUE);
    }

    public function down()
    {
        // Drop tabel dengan urutan yang tepat untuk hindari foreign key error
        $this->dbforge->drop_table('tbl_data_form', TRUE);
    }
}
