using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Model
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string Address { get; set; } = string.Empty;
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        [Required]
        public int Age { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }

        public ICollection<Transaction>? Transactions { get; set; }
    }
}
