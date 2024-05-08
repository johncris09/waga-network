<?php

defined('BASEPATH') or exit('No direct script access allowed');

class BarangayModel extends CI_Model
{

	public $table = 'barangay';

	public function getAll()
	{
		$query = $this->db
			->order_by('barangay', 'asc')
			->get($this->table);
		return $query->result();
	}
	public function findByBarangayName($barangay)
	{
		$query = $this->db
			->where('barangay', $barangay)
			->get($this->table);
		return $query->row();
	}

	
	

}