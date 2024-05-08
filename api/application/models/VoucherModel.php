<?php

defined('BASEPATH') or exit('No direct script access allowed');

class VoucherModel extends CI_Model
{

	public $table = 'voucher';

	public function getAll()
	{
		$query = $this->db
			->order_by('amount', 'asc')
			->get($this->table);
		return $query->result();
	}


	public function insert($data)
	{

		return $this->db->insert($this->table, $data);
	}

	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}


	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function delete($id)
	{
		return $this->db->delete($this->table, ['id' => $id]);
	}
	public function findByCourseName($course)
	{
		$query = $this->db
			->where('course', $course)
			->get($this->table);
		return $query->row();
	}

}
