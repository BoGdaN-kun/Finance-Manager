using Microsoft.EntityFrameworkCore;
using WebApplication1.Model;

namespace WebApplication1.Datacontext
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Transaction> Transactions { get; set; }    

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            /*modelBuilder.Entity<User>().HasKey(x => x.Id);*/
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.User)
                .WithMany(u => u.Transactions)
                .HasForeignKey(t => t.UserId)
                .IsRequired();
        }
        public void GenerateSampleData(int userCount, int transactionsPerUser)
        {
            

            // Generate users
            var users = Enumerable.Range(1, userCount).Select(_ => new User
            {
                Name = "User " + Guid.NewGuid().ToString().Substring(0, 8),
                Email = "user@example.com",
                Address = "Sample Address",
                PhoneNumber = "1234567890",
                Age = new Random().Next(18, 80),
                Transactions = new List<Transaction>() // Initialize empty list
            }).ToList();

            // Add users to the database
            Users.AddRange(users);
            SaveChanges();

            // Generate transactions for each user
            foreach (var user in users)
            {
                var transactions = Enumerable.Range(1, transactionsPerUser).Select(_ => new Transaction
                {
                    Amount = new Random().Next(1, 100),
                    Date = DateTime.Now.AddDays(-new Random().Next(1, 365)),
                    Description = "Sample Transaction",
                    Category = "Sample Category",
                    UserId = user.Id // Set the UserId foreign key
                }).ToList();

                // Add transactions to the database
                Transactions.AddRange(transactions);
                SaveChanges();
            }
        }
    }
}
