<?php

defined('BASEPATH') or exit('No direct script access allowed');

class CodeModel extends CI_Model
{

	public $table = 'code';

	public function __construct()
	{
		parent::__construct();
	}


	public function insert($data)
	{

		foreach ($data as $data_item) {

			$insert_query = $this->db->insert_string('code', $data_item);
			$insert_query = str_replace('INSERT INTO', 'INSERT IGNORE INTO', $insert_query);
			$insert = $this->db->query($insert_query);
			if (!$insert) {
				return false;
			}
		}
		return true;
	}


	public function get_reseller_available_code($data)
	{
		$this->db->where($data);
		$this->db->where('is_used', 0);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function total_available_code($amount)
	{


		$this->db->select('count(*) as total_available_code');
		$this->db->where('amount', $amount);
		$this->db->where('is_used', 0);
		$this->db->group_by('amount');
		$query = $this->db->get($this->table);

		if ($query->num_rows()) {
			return $query->row()->total_available_code;
		} else {
			return 0;
		}

	}


	public function total_used_code($id)
	{

		$this->db->select('count(*) as total_used_code');
		$this->db->where('is_used', 1);
		$this->db->where('user_id', $id);
		$query = $this->db->get($this->table);

		if ($query->num_rows()) {
			return $query->row()->total_used_code;
		} else {
			return 0;
		}
	}




	public function total_unused_code($id)
	{

		$this->db->select('count(*) as total_unused_code');
		$this->db->where('is_used', 0);
		$this->db->where('user_id', $id);
		$query = $this->db->get($this->table);

		if ($query->num_rows()) {
			return $query->row()->total_unused_code;
		} else {
			return 0;
		}
	}

	public function reseller_total_available_code($id, $amount)
	{

		$this->db->select('count(*) as total_available_code');
		$this->db->where('amount', $amount);
		$this->db->where('is_used', 0);
		$this->db->where('user_id', $id);
		$this->db->group_by('amount');
		$query = $this->db->get($this->table);

		if ($query->num_rows()) {
			return $query->row()->total_available_code;
		} else {
			return 0;
		}

	}

	public function get_reseller_code($id)
	{
		$query = $this->db
			->where('code.user_id', $id)
			->order_by('created_at desc')
			->get('code ');

		return $query->result();

	}

}
