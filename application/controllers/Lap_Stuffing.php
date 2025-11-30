<?php
defined('BASEPATH') or exit('No direct script access allowed');

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class Lap_Stuffing extends CI_Controller
{

    public function __construct()
    {
        parent::__construct();
        if (!$this->session->userdata('logged_in')) {
            redirect('login');
        }
        $this->load->model('M_stuffing', 'stuff'); // pastikan model dimuat
    }

    public function index()
    {
        // $user_id = $this->session->userdata('id');
        // $modul_akses = $this->user->get_modul_with_access($user_id); // ambil menu akses user

        $data = [
            'title'        => 'Laporan Stuffing',
            'conten'       => 'stuffing/lap/index',
            'footer_js' => array('assets/js/lap_stuffing.js'),
        ];
        $this->load->view('template/conten', $data);
    }

    public function tableLaporan()
    {
        $filter_type    = $this->input->post('filter_type');
        $start_date     = $this->input->post('date_start');
        $end_date       = $this->input->post('date_end');
        $etd_start      = $this->input->post('etd_start');
        $etd_end        = $this->input->post('etd_end');
        $buyer          = trim($this->input->post('buyer'));
        $counter_buyer  = trim($this->input->post('counter_buyer'));

        // 🔹 Cek input buyer & counter_buyer bersamaan
        if ($buyer !== '' && $counter_buyer !== '') {
            echo json_encode([
                'status'  => 'error',
                'message' => 'Silakan isi salah satu antara Buyer atau Counter Buyer, jangan keduanya.'
            ]);
            return;
        }

        // 🔹 Tentukan jenis filter
        $use_etd = ($etd_start && $etd_end);
        $use_buyer = ($buyer !== '' || $counter_buyer !== '');

        // 🔹 Panggil model sesuai kondisi
        if ($use_etd) {
            // Filter berdasarkan ETD
            $data['lap'] = $this->stuff->get_report_by_etd($etd_start, $etd_end, $buyer, $counter_buyer)->result();
        } elseif ($use_buyer) {
            // Filter berdasarkan Stuffing + Buyer/Counter
            $data['lap'] = $this->stuff->get_report($start_date, $end_date, $buyer, $counter_buyer)->result();
        } else {
            // Default filter berdasarkan Stuffing 30 hari ke belakang
            $data['lap'] = $this->stuff->get_report($start_date, $end_date)->result();
        }

        // 🔹 Jika data kosong
        if (empty($data['lap'])) {
            echo json_encode([
                'status' => 'empty',
                'message' => 'Data tidak ditemukan untuk filter yang dipilih.'
            ]);
            return;
        }

        // 🔹 Render tampilan tabel
        $html = $this->load->view('stuffing/lap/lap-table', $data, true);
        echo json_encode(['status' => 'success', 'html' => $html]);
    }

    public function export_excel()
    {
        ob_end_clean();

        // 🔹 Ambil parameter dari POST
        $start_date = $this->input->post('date_start');
        $end_date   = $this->input->post('date_end');

        // 🔹 Jika kosong → gunakan default 30 hari terakhir
        if (empty($start_date) || empty($end_date)) {
            $end_date   = date('Y-m-d');
            $start_date = date('Y-m-d', strtotime('-30 days'));
        }

        // 🔹 Ambil data dari model sesuai tanggal
        $query = $this->stuff->get_report($start_date, $end_date);
        $lap   = $query->result();

        if (empty($lap)) {
            echo "<script>alert('Tidak ada data untuk diexport pada range tanggal tersebut!'); window.history.back();</script>";
            exit;
        }

        // 🔹 Buat spreadsheet baru
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Laporan Stuffing');

        // Judul laporan
        $sheet->setCellValue('A1', 'LAPORAN STUFFING EXPORT');
        $sheet->mergeCells('A1:V1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Header kolom
        $header = [
            'No',
            'Tanggal Stuffing',
            'No Stuffing',
            'Buyer',
            'Counter Buyer',
            'ETD',
            'ETA',
            'Tujuan',
            'Total QTY Plan',
            'Total QTY Realisasi',
            'Total Vol Plan',
            'Total Vol Realisasi',
            'Selisih Vol',
            '% Vol Plan',
            '% Vol Realisasi',
            'Selisih % Vol',
            'Total Berat Plan',
            'Total Berat Realisasi',
            'Selisih Berat',
            '% Berat Plan',
            '% Berat Realisasi',
            'Selisih % Berat'
        ];

        $sheet->fromArray($header, NULL, 'A3');
        $sheet->getStyle('A3:V3')->getFont()->setBold(true);
        $sheet->getStyle('A3:V3')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('A3:V3')->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);

        // Isi data
        $row = 4;
        $no = 1;
        foreach ($lap as $data) {
            $vol = $data->volume ?? 0;
            $vol_real = $data->volume_real ?? 0;
            $sel_vol = max(0, $vol_real - $vol);

            $prosen_vol = $data->prosen_volume ?? 0;
            $prosen_vol_real = $data->prosen_volume_real ?? 0;
            $sel_prosen_vol = max(0, $prosen_vol_real - $prosen_vol);

            $berat = $data->berat ?? 0;
            $berat_real = $data->berat_real ?? 0;
            $sel_berat = max(0, $berat_real - $berat);

            $prosen_berat = $data->prosen_berat ?? 0;
            $prosen_berat_real = $data->prosen_berat_real ?? 0;
            $sel_prosen_berat = max(0, $prosen_berat_real - $prosen_berat);

            $sheet->fromArray([
                $no++,
                !empty($data->tgl_stuff) ? date('d-m-Y', strtotime($data->tgl_stuff)) : '',
                $data->kd_stuff ?? '',
                $data->buyer ?? '',
                $data->counter_buyer ?? '',
                !empty($data->tgl_etd) ? date('d-m-Y', strtotime($data->tgl_etd)) : '',
                !empty($data->tgl_eta) ? date('d-m-Y', strtotime($data->tgl_eta)) : '',
                $data->tujuan ?? '',
                $data->tot_qty_plan ?? 0,
                $data->tot_qty_real ?? 0,
                $vol,
                $vol_real,
                $sel_vol,
                number_format($prosen_vol, 2) . '%',
                number_format($prosen_vol_real, 2) . '%',
                number_format($sel_prosen_vol, 2) . '%',
                $berat,
                $berat_real,
                $sel_berat,
                number_format($prosen_berat, 2) . '%',
                number_format($prosen_berat_real, 2) . '%',
                number_format($sel_prosen_berat, 2) . '%',
            ], NULL, "A{$row}");

            $row++;
        }

        // ===========================================
        // 🔹 BAGIAN SUMMARY (TOTAL, RATA-RATA, DLL)
        // ===========================================
        $total_qty_plan = $total_qty_real = $total_vol = $total_vol_real = 0;
        $total_sel_vol = $total_prosen_vol = $total_prosen_vol_real = $total_sel_prosen_vol = 0;
        $total_berat = $total_berat_real = $total_sel_berat = $total_prosen_berat = $total_prosen_berat_real = $total_sel_prosen_berat = 0;

        $all_vol = [];
        $all_vol_real = [];

        foreach ($lap as $data) {
            $total_qty_plan += $data->tot_qty_plan;
            $total_qty_real += $data->tot_qty_real;
            $total_vol += $data->volume;
            $total_vol_real += $data->volume_real;
            $total_sel_vol += max(0, $data->volume_real - $data->volume);
            $total_prosen_vol += $data->prosen_volume;
            $total_prosen_vol_real += $data->prosen_volume_real;
            $total_sel_prosen_vol += max(0, $data->prosen_volume_real - $data->prosen_volume);
            $total_berat += $data->berat;
            $total_berat_real += $data->berat_real;
            $total_sel_berat += max(0, $data->berat_real - $data->berat);
            $total_prosen_berat += $data->prosen_berat;
            $total_prosen_berat_real += $data->prosen_berat_real;
            $total_sel_prosen_berat += max(0, $data->prosen_berat_real - $data->prosen_berat);

            $all_vol[] = $data->volume;
            $all_vol_real[] = $data->volume_real;
        }

        // ====== SUMMARY ======
        $count = count($lap);
        $avg_qty_plan = $count ? $total_qty_plan / $count : 0;
        $avg_qty_real = $count ? $total_qty_real / $count : 0;
        $avg_vol = $count ? $total_vol / $count : 0;
        $avg_vol_real = $count ? $total_vol_real / $count : 0;
        $avg_prosen_vol = $count ? $total_prosen_vol / $count : 0;
        $avg_prosen_vol_real = $count ? $total_prosen_vol_real / $count : 0;
        $avg_berat = $count ? $total_berat / $count : 0;
        $avg_berat_real = $count ? $total_berat_real / $count : 0;
        $avg_prosen_berat = $count ? $total_prosen_berat / $count : 0;
        $avg_prosen_berat_real = $count ? $total_prosen_berat_real / $count : 0;

        // ====== TOTAL ======
        $sheet->getStyle("A{$row}:V{$row}")->getFont()->setBold(true);
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'TOTAL');
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->fromArray([
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            $total_qty_plan,
            $total_qty_real,
            $total_vol,
            $total_vol_real,
            $total_sel_vol,
            round($total_prosen_vol, 2) . '%',
            round($total_prosen_vol_real, 2) . '%',
            round($total_sel_prosen_vol, 2) . '%',
            $total_berat,
            $total_berat_real,
            $total_sel_berat,
            round($total_prosen_berat, 2) . '%',
            round($total_prosen_berat_real, 2) . '%',
            round($total_sel_prosen_berat, 2) . '%'
        ], null, "A{$row}");
        $row++;

        // ====== RATA-RATA ======
        $sheet->getStyle("A{$row}:V{$row}")->getFont()->setBold(true);
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'RATA-RATA');
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $sheet->fromArray([
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            round($avg_qty_plan),
            round($avg_qty_real),
            round($avg_vol, 2),
            round($avg_vol_real, 2),
            '-',
            round($avg_prosen_vol, 2) . '%',
            round($avg_prosen_vol_real, 2) . '%',
            '-',
            round($avg_berat, 2),
            round($avg_berat_real, 2),
            '-',
            round($avg_prosen_berat, 2) . '%',
            round($avg_prosen_berat_real, 2) . '%',
            '-'
        ], null, "A{$row}");
        $row++;

        // ====== HIGHEST ======
        $sheet->getStyle("A{$row}:V{$row}")->getFont()->setBold(true);
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'HIGHEST');
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->fromArray([
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            '-',
            '-',
            max($all_vol),
            max($all_vol_real)
        ], null, "A{$row}");
        $row++;

        // ====== LOWEST ======
        $sheet->getStyle("A{$row}:V{$row}")->getFont()->setBold(true);
        $sheet->mergeCells("A{$row}:H{$row}");
        $sheet->setCellValue("A{$row}", 'LOWEST');
        $sheet->getStyle("A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->fromArray([
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            '-',
            '-',
            min($all_vol),
            min($all_vol_real)
        ], null, "A{$row}");

        // ====== FORMAT KOLOM PERSEN RATA KANAN ======
        // Kolom: % Vol Plan (N), % Vol Real (O), Selisih % Vol (P),
        // % Berat Plan (R), % Berat Real (S), Selisih % Berat (T)
        $percentCols = ['N', 'O', 'P', 'T', 'U', 'V'];
        foreach ($percentCols as $col) {
            $sheet->getStyle("{$col}1:{$col}{$row}")
                ->getAlignment()
                ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT);
        }

        // ===========================================
        // 🔹 FORMAT & OUTPUT
        // ===========================================
        $sheet->getStyle("A3:V" . ($row - 1))
            ->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
        $sheet->getStyle("I4:V" . ($row - 1))
            ->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);

        foreach (range('A', 'V') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $filename = 'Laporan_Stuffing_' . date('Ymd_His') . '.xlsx';
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header("Content-Disposition: attachment; filename=\"{$filename}\"");
        header('Cache-Control: max-age=0');

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }
}
