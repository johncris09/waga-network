<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Purchase extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('PurchaseModel');

		$this->load->model('ResellerModel');
		$this->load->model('BarangayModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$purchaseModel = new PurchaseModel;
		$result = $purchaseModel->getAll();
		$this->response($result, RestController::HTTP_OK);
	}


	public function insert_post()
	{

		$course = new PurchaseModel;
		$requestData = json_decode($this->input->raw_input_stream, true);



		$result = $course->insert($requestData);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Course Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function find_get($id)
	{
		$course = new PurchaseModel;
		$result = $course->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$course = new PurchaseModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'colCourse' => $requestData['course'],
			'colManager' => $requestData['manager'],

		);

		$update_result = $course->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$course = new PurchaseModel;
		$result = $course->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Course Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



	public function get_sales_by_address_by_voucher_get()
	{



		$resellerModel = new ResellerModel; 


		$request = $this->input->get();

		$filterData = [];
		if (isset($request['start_date']) && !empty($request['start_date'])) {
			$filterData['start_date'] = date('Y-m-d', strtotime($request['start_date']));
		}
		if (isset($request['end_date']) && !empty($request['end_date'])) {
			$filterData['end_date'] = date('Y-m-d', strtotime($request['end_date']));
		}

 
		// Fetch data
		$data['result'] = $resellerModel->getSalesByAddress($filterData); 



		// Prepare output 
		$output = [
			'labels' => [],
			'datasets' => [
				[
					'label' => '10',
					'data' => []
				],
				[
					'label' => '20',
					'data' => []
				],
				[
					'label' => '100',
					'data' => []
				],
				[
					'label' => '450',
					'data' => []
				]
			]
		];

		foreach ($data['result'] as $row) {
			$output['labels'][] = $row['address'];
			$output['datasets'][0]['data'][] = $row['voucher_10'];
			$output['datasets'][0]['backgroundColor'] = '#0dcaf0'; 

			$output['datasets'][1]['data'][] = $row['voucher_20'];
			$output['datasets'][1]['backgroundColor'] = '#FFC55A'; 

			$output['datasets'][2]['data'][] = $row['voucher_100'];
			$output['datasets'][2]['backgroundColor'] = '#E1ACAC'; 

			$output['datasets'][3]['data'][] = $row['voucher_450'];
			$output['datasets'][3]['backgroundColor'] = '#8DECB4'; 
		}


		$this->response($output, RestController::HTTP_OK);
	}

 


}
