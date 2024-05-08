<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Code extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->objOfJwt = new CreatorJwt();
		$this->load->model('CodeModel');

		$this->load->helper('crypto_helper');
	}



	// get the available code of the reseller of a specific ammount
	public function get_reseller_available_code_get()
	{

		$codeModel = new CodeModel;
		$result = $codeModel->get_reseller_available_code($this->input->get());

		$this->response($result, RestController::HTTP_OK);
	}

	public function insert_post()
	{

		$codeModel = new CodeModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$result = $codeModel->insert($requestData);



		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Code Uploaded Successfully.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to create course.'
			], RestController::HTTP_OK);

		}


	}

	public function update_put($id)
	{

		$codeModel = new CodeModel;

		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'is_used' => $requestData['is_used'],
		);
		$update_result = $codeModel->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Success'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update Course.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}


}
