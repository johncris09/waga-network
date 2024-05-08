<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class AdvanceSearch extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('AdvanceSearchModel');
		$this->load->helper('crypto_helper');
	}

	public function find_get()
	{


		$model = new AdvanceSearchModel;
		$requestData = $this->input->get();
		$result = $model->search($requestData['query']);
		$this->response($result, RestController::HTTP_OK);
	}


}
