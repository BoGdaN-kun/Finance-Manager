namespace WebApplication1.DTOs
{
    public record TransactionDTO
    {
        public float Amount { get; init; }
        public string Category { get; init; } = string.Empty;
        public string Description { get; init; } = string.Empty;
        public string Date { get; init; }
        public int UserId { get; init; }

    }
}
