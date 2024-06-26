﻿namespace WebApplication1.Model
{
    public class Transaction
    {
        public int Id { get; set; }
        public float Amount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; } // Navigation property
    }
}
