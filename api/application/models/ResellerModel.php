<?php

defined('BASEPATH') or exit('No direct script access allowed');

class ResellerModel extends CI_Model
{

	public $table = 'users';

	public function __construct()
	{
		parent::__construct();
	}

	public function get()
	{
		$query = $this->db
			->select('users.id as id, users.first_name,
			users.last_name, users.middle_name, users.contact_number,
			barangay.barangay as address, barangay.id as address_id,
			users.username, users.role_type')
			->where('users.address = barangay.id')
			->where('users.role_type', 'reseller')
			->order_by('users.first_name')
			->get('users, barangay');

		return $query->result();

	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function login($data)
	{
		$query = $this->db
			->select('*')
			->from($this->table)
			->where('username', $data['username'])
			->get();
		$result = $query->row();


		if ($result) {

			if (md5($data['password']) == $result->password) {
				return $result; // Passwords match
			}
		}

		return false;

	}



	public function find($id)
	{
		$query = $this->db
			->where('id', $id)
			->get($this->table);
		return $query->row();
	}

	public function get_total()
	{
		$query = $this->db
			->where('users.role_type', 'reseller')
			->get($this->table);
		return $query->num_rows();
	}


	public function getSalesByAddress($filterData)
	{
		$query_address = $this->db->query("select * from barangay");
		$addresses = $query_address->result();
		$query_voucher = $this->db->query("select * from voucher");
		$vouchers = $query_voucher->result();
		$data = [];
		$query_string = '';
		foreach ($addresses as $address) {
			$query_string .= ' SELECT barangay.barangay,';
			$count = 1;
			foreach ($vouchers as $voucher) {
				$query_string .= " SUM(CASE WHEN code.amount = " . (int) $voucher->amount . " 
				THEN code.amount ELSE 0 END) AS voucher_" . (int) $voucher->amount;
				if ($count == 4) {
					continue;
				} else {
					$query_string .= ", ";
				}

				$count++;
			}
			$query_string .= " from 
			barangay, users, purchase, code
			where 
				barangay.id = users.address
			and 
			users.id = purchase.user_id
			and 
			purchase.code_id = code.id
			and barangay.id = " . $address->id;
			if (isset($filterData) && !empty($filterData)) {

				$query_string .= " and date(purchase.purchase_date) BETWEEN '" . $filterData['start_date'] . "'
					 and  '" . $filterData['end_date'] . "' ";
			}

			$query = $this->db->query($query_string);
			$result = $query->row();
 

			$data[] = array(
				'address' => $address->barangay,
			);
			foreach ($vouchers as $voucher) {
				$amount = (int) $voucher->amount;
				$key = 'voucher_' . $amount;
				$data[count($data) - 1][$key] = isset($result->$key) && !empty($result->$key) ? $result->$key : 0;
			}

			$query_string = ''; 

		}
		return $data; 
	}

}
