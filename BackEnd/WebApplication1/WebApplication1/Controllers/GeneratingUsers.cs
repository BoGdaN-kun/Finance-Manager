using Bogus;
using System.Text.Json;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    public class GeneratingUsers
    {

        public List<User> generateData(int n)
        {
            var fakeUser = new Faker<User>("ko")
            .RuleFor(u => u.Id, f => f.IndexFaker)
            .RuleFor(u => u.Name, f => f.Name.FullName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Address, f => f.Address.FullAddress())
            .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
            .RuleFor(u => u.Age, f => f.Random.Number(18, 80));

            var faked = fakeUser.Generate(n);
            return faked;
        }
        public async Task<List<User>> generateData2(int n)
        {
            var fakeUser = new Faker<User>("ko")
            .RuleFor(u => u.Name, f => f.Name.FullName())
            .RuleFor(u => u.Email, f => f.Internet.Email())
            .RuleFor(u => u.Address, f => f.Address.FullAddress())
            .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
            .RuleFor(u => u.Age, f => f.Random.Number(18, 80));

            var faked = fakeUser.Generate(n);
            return faked;
        }

        public List<User> GenerateSampleData(int userCount, int transactionsPerUser)
        {
            var users = new Faker<User>()
                .RuleFor(u => u.Name, f => f.Name.FullName())
                .RuleFor(u => u.Email, f => f.Internet.Email())
                .RuleFor(u => u.Address, f => f.Address.FullAddress())
                .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
                .RuleFor(u => u.Age, f => f.Random.Number(18, 80))
                .Generate(userCount);

            foreach (var user in users)
            {
                int randomTr = new Random().Next(1, transactionsPerUser);
                user.Transactions = new Faker<Transaction>()
                    .RuleFor(t => t.Amount, f => f.Random.Float(0, 10000))
                    .RuleFor(t => t.Date, f => f.Date.Past())
                    .RuleFor(t => t.Description, f => f.Commerce.ProductName())
                    .RuleFor(t => t.Category, f => f.Commerce.Department())
                    .Generate(randomTr);
            }

            return users;
        }

        public List<User> GenerateDataWithTransactions(int n)
        {
            var fakeUser = new Faker<User>("ko")
                .RuleFor(u => u.Name, f => f.Name.FullName())
                .RuleFor(u => u.Email, f => f.Internet.Email())
                .RuleFor(u => u.Address, f => f.Address.FullAddress())
                .RuleFor(u => u.PhoneNumber, f => f.Phone.PhoneNumber())
                .RuleFor(u => u.Age, f => f.Random.Number(18, 80));

            var fakedUsers = fakeUser.Generate(n);

            foreach (var user in fakedUsers)
            {
                // Generate transactions for each user
                user.Transactions = GenerateTransactionsForUser(user.Id); // Assuming you have a method to generate transactions for a user
            }

            return fakedUsers;
        }


        private List<Transaction> GenerateTransactionsForUser(int userId)
        {
            var transactions = new List<Transaction>();
            var random = new Random();

            // Generate a random number of transactions for the user
            var numTransactions = random.Next(1, 6); // Generate between 1 and 5 transactions

            for (int i = 0; i < numTransactions; i++)
            {
                var transaction = new Transaction
                {
                    UserId = userId, // Associate the transaction with the user
                                     // Generate other transaction properties as needed
                    Amount =  1000, // Generate a random amount
                    Date = DateTime.UtcNow.AddDays(-random.Next(1, 30)) // Generate a random date within the last month
                };

                transactions.Add(transaction);
            }

            // Save transactions to the database or perform any other necessary actions

            return transactions;
        }

    }
}
