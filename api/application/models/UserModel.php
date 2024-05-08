<?php

defined('BASEPATH') or exit('No direct script access allowed');

class UserModel extends CI_Model
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
			->get('users, barangay');
		return $query->result();

	}

	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}

	public function login($data)
	{
		$this->db->select('*');
		$this->db->from($this->table);
		$this->db->where('username', $data['username']); // Fixed array key
		$query = $this->db->get();
		$result = $query->row();


		if ($result) {

			if (md5($data['password']) == $result->password) {
				return $result; // Passwords match
			}
		}

		return false;

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


	public function find($id)
	{
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}




	public function get_total()
	{
		$query = $this->db
			// ->where('users.role_type !=','reseller')
			->get($this->table);
		return $query->num_rows();
	}
}
