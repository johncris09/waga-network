<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . '/libraries/CreatorJwt.php';
require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class User extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->objOfJwt = new CreatorJwt();
		$this->load->model('UserModel');
		$this->load->helper('crypto_helper');
	}




	public function index_get()
	{
		$user = new UserModel;
		$result = $user->get();
		$this->response($result, RestController::HTTP_OK);
	}


	// number of resellers
	public function get_total_get()
	{
		
		$userModel = new UserModel; 


		$result = $userModel->get_total();
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
	public function update_put($id)
	{


		$model = new UserModel;
		$requestData = json_decode($this->input->raw_input_stream, true);

		if (isset($requestData['first_name'])) {
			$data['first_name'] = $requestData['first_name'];
		}
		if (isset($requestData['last_name'])) {
			$data['last_name'] = $requestData['last_name'];
		}
		if (isset($requestData['middle_name'])) {
			$data['middle_name'] = $requestData['middle_name'];
		}
		if (isset($requestData['contact_number'])) {
			$data['contact_number'] = $requestData['contact_number'];
		}
		if (isset($requestData['address'])) {
			$data['address'] = $requestData['address'];
		}

		if (isset($requestData['username'])) {
			$data['username'] = $requestData['username'];
		}
		if (isset($requestData['role_type'])) {
			$data['role_type'] = $requestData['role_type'];
		}
	

		$result = $model->update($id, $data); 


		if ($result) {
			$this->response([
				'status' => true,
				'message' => 'Successfully Updated.'
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



	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////


	public function online_get()
	{
		$user = new UserModel;
		$CryptoHelper = new CryptoHelper;
		$result = $user->get_online();
		$this->response($result, RestController::HTTP_OK);
	}




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
