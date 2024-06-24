/*using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Controllers;
using WebApplication1.Interfaces;

namespace WebApplication1.Tests.Controller
{
    internal class TransactionControllerTets
    {
        [Fact]
        public async Task GetAllTransactionsAsync()
        {
           */ /*var transactioNRepostiroy = new Mock<ITransactionRepositoryAsync>();
            var fakeTransactions = new List<Transaction>
            {
                new Transaction {Id = 1, Amount = 100, Date = DateTime.Now, Type = "Credit", UserId = 1},
                new Transaction {Id = 2, Amount = 200, Date = DateTime.Now, Type = "Debit", UserId = 2}
            };

            transactioNRepostiroy.Setup(x => x.GetTransactions()).ReturnsAsync(fakeTransactions);

            var controller = new TransactionController(transactioNRepostiroy.Object);

            var result = await controller.GetAllTransactionsAsync();

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);*/ /*
        }

    }
}
*/

