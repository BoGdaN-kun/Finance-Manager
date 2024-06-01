using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WebApplication1.DTOs;
using WebApplication1.Interfaces;
using WebApplication1.Model;
using WebApplication1.Repository;

namespace WebApplication1.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class TransactionControllerAsync : Controller
    {
        private readonly ITransactionRepositoryAsync transactionRepository;
        
        public TransactionControllerAsync(ITransactionRepositoryAsync _transactionRepository)
        {
            this.transactionRepository = _transactionRepository;
        }

        [HttpGet(Name = "AllTransactions")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await transactionRepository.GetTransactions();
            return Ok(transactions);
        }

        [HttpGet("{id:int}", Name = "GetTransactionById")]
        [ProducesResponseType(200, Type = typeof(Transaction))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var transaction = await transactionRepository.GetTransactionById(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found!");
            }
            return Ok(transaction);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddTransaction([FromBody] TransactionDTO transactionDTO)
        {
            try
            {
                var transaction = new Transaction
                {
                    Amount = transactionDTO.Amount,
                    Date = DateTime.Parse(transactionDTO.Date),
                    Category = transactionDTO.Category,
                    UserId = transactionDTO.UserId,
                    Description = transactionDTO.Description
                };
                await transactionRepository.AddTransaction(transaction);
                return CreatedAtRoute("GetTransactionById", new { id = transaction.Id }, transaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTransaction([FromBody] Transaction transaction)
        {
            try
            {
                await transactionRepository.UpdateTransaction(transaction);
                return Ok(transaction);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTransaction([FromRoute] int id)
        {
            try
            {
                var result = await transactionRepository.DeleteTransaction(id);
                if (result)
                {
                    return Ok("Transaction deleted successfully!");
                }
                return NotFound("Transaction not found!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("transactionpaginated", Name = "transactionpaginated")]
        public async Task<IActionResult> GetUserTransactionCount2(int page = 1, int pageSize = 50)
        {
            try
            {
                var transactions = await transactionRepository.GetTransactions(); // Assuming GetUsers() returns a collection of User objects

               

                // Calculate the number of users to skip based on page number and page size
                var skip = (page - 1) * pageSize;

                // Get users for the current page
                var pagedUsers = transactions.Skip(skip).Take(pageSize).ToList();

                var userTransactionCountList = new List<Transaction>();
    
                userTransactionCountList.AddRange(pagedUsers);
                // Return the paged user data along with total count for pagination on the front end
                return Ok(userTransactionCountList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //GetAllPaginatedBasedOnRole
        [HttpGet("detailsTransaction", Name = "transactionpaginatedbasedonrole")]
        public async Task<IActionResult> GetUserTransactionCountBasedOnRole(int? page = null, int? pageSize = null)
        {
            try
            {

                var jwtToken = HttpContext.Request.Cookies["token"];

                if (string.IsNullOrEmpty(jwtToken))
                {
                    return Unauthorized(); // JWT token not found in cookie
                }
                // Parse JWT token to extract user information
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.ReadJwtToken(jwtToken);

                // Extract user ID from the JWT token
                var userId = token.Claims.FirstOrDefault(claim => claim.Type == "UserId")?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(); // User ID not found in token
                }

                //check if admin
                var isAdmin = token.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" && claim.Value == "Admin") != null;
                if (isAdmin && page.HasValue && pageSize.HasValue && page > 0 && pageSize > 0)
                {
                    // Paginate user details if admin
                    var transactions = await transactionRepository.GetTransactionsPaginated((int)page, (int)pageSize);
                    return Ok(transactions);
                }
                else
                {
                    var transactions = await transactionRepository.GetTransactionsByUserId(int.Parse(userId)); 
                    if (transactions == null)
                    {
                        return NotFound("User not found!");
                    }
                    return Ok(transactions);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }

}
