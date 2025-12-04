<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Migration_Migrate2 extends CI_Migration
{

    public function up()
    {
        // Buat tabel users untuk PostgreSQL
        $this->dbforge->add_field([
            'id' => [
                'type' => 'SERIAL', // PostgreSQL auto increment
                'unsigned' => TRUE
            ],
            'name' => [
                'type' => 'VARCHAR',
                'constraint' => '100',
                'null' => FALSE
            ]
        ]);

        $this->dbforge->add_key('id', TRUE); // Primary key
        $this->dbforge->add_field("created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        $this->dbforge->create_table('tbl_prod_kategori', TRUE);
    }

    public function down()
    {
        // Drop tabel dengan urutan yang tepat untuk hindari foreign key error
        $this->dbforge->drop_table('tbl_prod_kategori', TRUE);
    }
}
