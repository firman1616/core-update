<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require_once APPPATH . '../vendor/autoload.php';

class Pdf {
    public function load($param = [])
    {
        return new \Mpdf\Mpdf($param);
    }
}