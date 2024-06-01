using WebApplication1.Model;

namespace WebApplication1.Interfaces
{
    public interface ITransactionRepositoryAsync
    {
        Task<ICollection<Transaction>> GetTransactions();
        Task<Transaction> GetTransactionById(int id);
        Task AddTransaction(Transaction user);
        Task UpdateTransaction(Transaction user);
        Task<bool> DeleteTransaction(int id);
        int GetTransactionCount(int id);
        Task<ICollection<Transaction>> GetTransactionsByUserId(int id);
        Task<ICollection<Transaction>> GetTransactionsPaginated(int page = 1, int pageSize = 50);
    }
}
