<?php
defined('BASEPATH') or exit('No direct script access allowed');

require APPPATH . 'libraries/RestController.php';
require APPPATH . 'libraries/Format.php';

use chriskacerguis\RestServer\RestController;

class Barangay extends RestController
{

	function __construct()
	{
		// Construct the parent class
		parent::__construct();
		$this->load->model('BarangayModel');
		$this->load->helper('crypto_helper');
	}
	public function index_get()
	{
		$model = new BarangayModel;
		 $result = $model->getAll();
		$this->response($result, RestController::HTTP_OK);
	}
 


}