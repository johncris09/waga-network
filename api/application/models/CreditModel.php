<?php

defined('BASEPATH') or exit('No direct script access allowed');

class CreditModel extends CI_Model
{

	public $table = 'credit';

	public function __construct()
	{
		parent::__construct();
	}



	public function insert($data)
	{
		return $this->db->insert($this->table, $data);
	}


	public function get_reseller_credit($id)
	{
		$query = $this->db
			->where('credit.user_id', $id)
			->order_by('created_at desc')
			->get('credit ');

		return $query->result();

	}

	public function update($id, $data)
	{
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}



	public function get_reseller_total_credit($id)
	{
		$this->db->select('sum(amount) as total_credit');
		$this->db->where('user_id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}



	public function get_reseller_net_credit($id)
	{
		$this->db->select('sum(amount) as total_credit');
		$this->db->where('user_id', $id);
		$query = $this->db->get($this->table);
		return $query->row();
	}

}
