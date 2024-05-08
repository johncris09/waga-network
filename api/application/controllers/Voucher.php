<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Voucher extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('VoucherModel');
		$this->load->model('CodeModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new VoucherModel;
		$result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}

	public function insert_post()
	{

		$model = new VoucherModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'amount' => $requestData['amount'],
		);
		$result = $model->insert($data);

		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'New Voucher Created.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create Voucher.'
			], RestController::HTTP_BAD_REQUEST);

		}


	}



	public function find_get($id)
	{
		$model = new VoucherModel;
		$result = $model->find($id);

		$this->response($result, RestController::HTTP_OK);

	}

	public function update_put($id)
	{


		$model = new VoucherModel;

		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'amount' => $requestData['amount'],

		);

		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Voucher Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Voucher.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


	public function delete_delete($id)
	{
		$model = new VoucherModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Voucher Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete Voucher.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
