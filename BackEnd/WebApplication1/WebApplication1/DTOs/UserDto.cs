using System.ComponentModel.DataAnnotations;

namespace WebApplication1.DTOs
{
    public record UserDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
  
        public string Address { get; set; } = string.Empty;

        public string PhoneNumber { get; set; } = string.Empty;

      
        public int Age { get; set; }
    }
}
