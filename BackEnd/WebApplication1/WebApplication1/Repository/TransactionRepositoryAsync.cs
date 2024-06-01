using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Controllers;
using WebApplication1.Datacontext;
using WebApplication1.Hubs;
using WebApplication1.Interfaces;
using WebApplication1.Model;

namespace WebApplication1.Repository 
{
    public class TransactionRepositoryAsync : ITransactionRepositoryAsync
    {
        private readonly IDbContextFactory<DataContext> _contextFactory;

        public TransactionRepositoryAsync(IDbContextFactory<DataContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        public async Task AddTransaction(Transaction transaction)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                if (transaction.Amount <= 0)
                {
                    throw new ArgumentException("Amount must be greater than 0");
                }
                if (transaction.Date == null)
                {
                    throw new ArgumentException("Date is required");
                }
                if (transaction.Category == null)
                {
                    throw new ArgumentException("Category is required");
                }
                if (transaction.UserId == null)
                {
                    throw new ArgumentException("UserId is required");
                }
                context.Transactions.Add(transaction);
                await context.SaveChangesAsync();
            }
        }

        public int GetTransactionCount(int id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                return context.Transactions.Count(x => x.UserId == id);
            }
        }

        public async Task<bool> DeleteTransaction(int id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var transaction = await context.Transactions.FindAsync(id);
                if (transaction == null)
                {
                    return false;
                }
                context.Transactions.Remove(transaction);
                await context.SaveChangesAsync();
                return true;
            }
        }

        public async Task<ICollection<Transaction>> GetTransactions()
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    return await context.Transactions.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<Transaction> GetTransactionById(int id)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    return await context.Transactions.FindAsync(id);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateTransaction(Transaction transaction)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                context.Transactions.Update(transaction);
                await context.SaveChangesAsync();
            }
        }

        public async Task<ICollection<Transaction>> GetTransactionsByUserId(int id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                return await context.Transactions.Where(x => x.UserId == id).ToListAsync();
            }
        }

        public async Task<ICollection<Transaction>> GetTransactionsPaginated(int page = 1, int pageSize = 50)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    // Use pagination to limit the number of records fetched from the database
                    return await context.Transactions
                                        .Skip((page - 1) * pageSize)
                                        .Take(pageSize)
                                        .ToListAsync();
                }
            }
            catch (Exception ex)
            {
                // Log the exception details (you can use any logging framework you prefer)
                // Example: _logger.LogError(ex, "An error occurred while fetching transactions.");
                throw new Exception("An error occurred while fetching transactions.", ex);
            }
        }

    }
}
