<?php

defined('BASEPATH') or exit('No direct script access allowed');

class PurchaseModel extends CI_Model
{

	public $table = 'purchase';

	public function getAll()
	{
		$query = $this->db
			->order_by('purchase_date', 'desc')
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

	public function get_reseller_total_purchase($id)
	{


		$this->db->select('sum(code.amount) as total_purchase');
		$this->db->where('purchase.code_id = code.id');
		$this->db->where('purchase.user_id', $id);
		$query = $this->db->get('purchase, code');
		return $query->row();
	}




	public function get_reseller_purchase($id)
	{
		$query = $this->db
			->select('purchase.id, purchase.purchase_date, code.code, code.amount ')
			->where('purchase.code_id = code.id')
			->where('purchase.user_id', $id)
			->order_by('purchase.purchase_date desc')
			->get('purchase, code ');

		return $query->result();

	}





}
