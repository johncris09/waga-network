<?php

defined('BASEPATH') or exit('No direct script access allowed');

class AdvanceSearchModel extends CI_Model
{

	public function search($searchValue)
	{ 
		$this->db->or_like('first_name', $searchValue);
		$this->db->or_like('middle_name', $searchValue);
		$this->db->or_like('last_name', $searchValue);
		$this->db->or_like("CONCAT(first_name, ' ', last_name, ' ', middle_name)", $searchValue);
		$this->db->or_like("CONCAT(last_name, ', ', first_name, ' ', middle_name)", $searchValue);

 		$this->db->where('role_type', 'reseller');
		$query = $this->db->get('users');

		return $query->result();
	}

}
