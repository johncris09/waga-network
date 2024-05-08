<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Reseller extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->objOfJwt = new CreatorJwt();
		$this->load->model('CreditModel');
		$this->load->model('ResellerModel');
		$this->load->model('PurchaseModel');
		$this->load->model('CodeModel');
		$this->load->model('VoucherModel');

		$this->load->helper('crypto_helper');
	}


	public function get_reseller_net_credit_get($reseller_id)
	{

		$creditModel = new CreditModel;
		$purchaseModel = new PurchaseModel;

		// get the total credit
		$total_credit = $creditModel->get_reseller_total_credit($reseller_id);
		$total_credit = (float) $total_credit->total_credit;

		// get the total purhcase
		$total_purchase = $purchaseModel->get_reseller_total_purchase($reseller_id);
		$total_purchase = (float) $total_purchase->total_purchase;

		// subtract total credit to total purhcase
		$net = $total_credit - $total_purchase;
		$this->response($net, RestController::HTTP_OK);
	}


	public function index_get()
	{
		$resellerModel = new ResellerModel;
		$purchaseModel = new PurchaseModel;
		$creditModel = new CreditModel;
		$codeModel = new CodeModel;


		$result = $resellerModel->get();
		foreach ($result as $row) {

			// get the total credit
			$total_credit = $creditModel->get_reseller_total_credit($row->id);
			$total_credit = (float) $total_credit->total_credit;

			// get the total purhcase
			$total_purchase = $purchaseModel->get_reseller_total_purchase($row->id);
			$total_purchase = (float) $total_purchase->total_purchase;

			// subtract total credit to total purhcase
			$net_credit = $total_credit - $total_purchase;
			$total_used_code = $codeModel->total_used_code($row->id);
			$total_unused_code = $codeModel->total_unused_code($row->id);
			$data[] = array(
				'id' => $row->id,
				'first_name' => $row->first_name,
				'last_name' => $row->last_name,
				'middle_name' => $row->middle_name,
				'address' => $row->address,
				'contact_number' => $row->contact_number,
				// 'total_credit' => number_format($total_credit, 2),
				// 'total_purchase' => number_format($total_purchase, 2),
				// 'net_credit' => number_format($net_credit, 2),
				'total_credit' => $total_credit,
				'total_purchase' => $total_purchase,
				'net_credit' => $net_credit,
				'total_used_code' => $total_used_code,
				'total_unused_code' => $total_unused_code,
			);

		}
		$this->response($data, RestController::HTTP_OK);
	}


	public function get_get($id)
	{

		$resellerModel = new ResellerModel;
		$result = $resellerModel->find($id);
		$this->response($result, RestController::HTTP_OK);

	}
	public function get_credit_get($id)
	{

		$creditModel = new CreditModel;
		$result = $creditModel->get_reseller_credit($id);
		$data = [];
		foreach ($result as $row) {
			$data[] = array(
				'id' => $row->id,
				'user_id' => $row->user_id,
				'amount' => $row->amount,
				'date_created' => date('Y-m-d', strtotime($row->created_at)),
				'time_created' => date('h:m:i A', strtotime($row->created_at)),
			);
		}
		$this->response($data, RestController::HTTP_OK);

	}

	public function get_code_get($id)
	{

		$codeModel = new CodeModel;
		$result = $codeModel->get_reseller_code($id);
		$data = [];
		foreach ($result as $row) {
			$data[] = array(
				'id' => $row->id,
				'code' => $row->code,
				'user_id' => $row->user_id,
				'amount' => $row->amount,
				'is_used' => $row->is_used,
				'date_created' => date('Y-m-d', strtotime($row->created_at)),
				'time_created' => date('h:i:s A', strtotime($row->created_at)),
			);
		}
		$this->response($data, RestController::HTTP_OK);

	}



	public function get_purchase_get($id)
	{

		$purchaseModel = new PurchaseModel;
		$result = $purchaseModel->get_reseller_purchase($id);
		$data = [];
		foreach ($result as $row) {
			$data[] = array(
				'id' => $row->id,
				'code' => $row->code,
				'amount' => $row->amount,
				'date_created' => date('Y-m-d', strtotime($row->purchase_date)),
				'time_created' => date('h:i:s A', strtotime($row->purchase_date)),
			);
		}
		$this->response($data, RestController::HTTP_OK);

	}



	public function get_voucher_get($id)
	{
		$voucherModel = new VoucherModel;
		$codeModel = new CodeModel;
		$result = $voucherModel->getAll();
		$data = [];

		foreach ($result as $row) {
			$reseller_total_available_code = $codeModel->reseller_total_available_code($id, $row->amount);
			$data[] = array(
				'id' => $row->id,
				'amount' => $row->amount,
				'total_available_code' => (int) $reseller_total_available_code
			);
		}
		$this->response($data, RestController::HTTP_OK);

	}



	// number of resellers
	public function get_total_get()
	{
		
		$resellerModel = new ResellerModel; 


		$result = $resellerModel->get_total();
		$this->response($result, RestController::HTTP_OK);

	}

	public function register_post()
	{

		$model = new UserModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'first_name' => trim($requestData['first_name']),
			'middle_name' => trim($requestData['middle_name']),
			'last_name' => trim($requestData['last_name']),
			'contact_number' => trim($requestData['contact_number']),
			'address' => $requestData['address'],
			'username' => trim($requestData['username']),
			'password' => trim(md5($requestData['password'])),
			'role_type' => $requestData['role_type'],
		);
		$result = $model->insert($data);
		if ($result) {
			$this->response([
				'status' => true,
				'message' => $requestData['form_type'] == 'Signup' ? 'Signup Successfully.' : 'Inserted Successfully'
			], RestController::HTTP_OK);
		} else {

			$this->response([

				...$this->db->error()
			], RestController::HTTP_BAD_REQUEST);
		}
	}

	public function login_post()
	{


		try {
			$userModel = new UserModel;
			$requestData = json_decode($this->input->raw_input_stream, true);


			$userLogin = $userModel->login($requestData);


			if ($userLogin) {

				// create token information
				$tokenData['id'] = $userLogin->id;
				$tokenData['first_name'] = $userLogin->first_name;
				$tokenData['middle_name'] = $userLogin->middle_name;
				$tokenData['last_name'] = $userLogin->last_name;
				$tokenData['contact_number'] = $userLogin->contact_number;
				$tokenData['username'] = $userLogin->username;
				$tokenData['role_type'] = $userLogin->role_type;
				$jwtToken = $this->objOfJwt->GenerateToken($tokenData);



				$this->response([
					'status' => true,
					'token' => $jwtToken,
					'role_type' => $userLogin->role_type,
					'message' => 'Login Successfully',
				], RestController::HTTP_OK);

			} else {

				$this->response([
					'status' => false,
					'message' => 'Invalid Username/Password. Please Try Again!',
				], RestController::HTTP_OK);
			}


		} catch (Exception $e) {
			// Handle other exceptions here


			$this->response([
				'status' => false,
				"message" => "Internval Server Error"
			], RestController::HTTP_BAD_REQUEST);



		}

	}

	public function insert_credit_post()
	{

		$creditModel = new CreditModel;
		$requestData = json_decode($this->input->raw_input_stream, true);


		$data = array(
			'amount' => trim($requestData['amount']),
			'user_id' => trim($requestData['user_id']),
		);
		$result = $creditModel->insert($data);
		if ($result) {
			$this->response([
				'status' => true,
				'message' => 'Added Successfully',
			], RestController::HTTP_OK);
		} else {

			$this->response([

				...$this->db->error()
			], RestController::HTTP_BAD_REQUEST);
		}
	}
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////






	public function find_get($id)
	{

		$model = new UserModel;
		$result = $model->find($id);
		$this->response($result, RestController::HTTP_OK);

	}









	public function delete_delete($id)
	{
		$model = new UserModel;
		$result = $model->delete($id);
		if ($result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Deleted.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to delete.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}




	public function change_password_put($id)
	{


		$model = new UserModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		$data = array(
			'password' => md5($requestData['password']),
		);

		$update_result = $model->update($id, $data);

		if ($update_result > 0) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
			], RestController::HTTP_OK);
		} else {

			$this->response([
				'status' => false,
				'message' => 'Failed to update.'
			], RestController::HTTP_BAD_REQUEST);

		}
	}



}
