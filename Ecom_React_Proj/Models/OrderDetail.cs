using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactAspx.Models
{ 

	//OrderDetail table
	public class OrderDetail
	{
		[Key] 
		public int Id { get; set; }
		public int OrderId { get; set; }
		public int FoodItemId { get; set; }
		public int Quantity { get; set; }
		public decimal TotalPrice { get; set; }
		public string Comment { get; set; }
	}
}