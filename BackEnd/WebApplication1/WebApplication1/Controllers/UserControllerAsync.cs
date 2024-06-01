using Bogus;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using WebApplication1.DTOs;
using WebApplication1.Interfaces;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserControllerAsync : Controller
    {
        private readonly IUserRepositoryAsync userRepository;
        private readonly ITransactionRepositoryAsync transactionRepository;

        public UserControllerAsync(IUserRepositoryAsync _userRepository, ITransactionRepositoryAsync transactionRepository)
        {
            this.userRepository = _userRepository;
            this.transactionRepository = transactionRepository;
        }


        [HttpGet(Name = "AllAs")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await userRepository.GetUsers();
            return Ok(users);
        }

        [HttpGet("{id:int}", Name = "GetUserByIdAS")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var user = await userRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            return Ok(user);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddUser([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = new User
                {
                    Name = userDTO.Name,
                    Email = userDTO.Email,
                    Address = userDTO.Address,
                    PhoneNumber = userDTO.PhoneNumber,
                    Age = userDTO.Age,
                    Transactions = null, // Set Transactions to null
                    Role = "User",
                    Password = "password"
                };
                //user.Id = userRepository.GetUsers().Max(x => x.Id) + 1;
                await userRepository.AddUser(user);
                return CreatedAtRoute("GetUserById", new { id = user.Id }, user);
                //return Ok(GetAllUsers());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser([FromBody] UserDTO userDto)
        {
            try
            {
               /* User user = new User
                {
                    Id = userDto.Id,
                    Name = userDto.Name,
                    Email = userDto.Email,
                    Address = userDto.Address,
                    PhoneNumber = userDto.PhoneNumber,
                    Age = userDto.Age,
                    Transactions = null 
                };*/
                var user = await userRepository.GetUserById(userDto.Id);
                user.PhoneNumber = userDto.PhoneNumber;
                user.Name = userDto.Name;
                user.Email = userDto.Email;
                user.Address = userDto.Address;
                user.Age = userDto.Age;
                // Update user in the repository
                await userRepository.UpdateUser(user);
                return Ok(user);
                //return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteUser([FromRoute] int id)
        {
            try
            {
                var userToDelete = await userRepository.GetUserById(id);
                if (userToDelete == null)
                {
                    return NotFound("User not found!");
                }

                await userRepository.DeleteUser(userToDelete.Id);

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("idname", Name = "GetIdNameUsers")]
        [Authorize(Roles = "Admin,User")]
        public async Task<IActionResult> GetIdNameUsers()
        {
            var idNameList = await userRepository.GetIdName();
            return Ok(idNameList);
            /*var users = await userRepository.GetUsers(); // Assuming GetUsers() returns a collection of User objects
            var idNameList = users.Select(u => new IdNameDTO { Id = u.Id, Name = u.Name }).ToList();
            return Ok(idNameList);*/
        }
        [HttpGet("transactioncount", Name = "GetUserTransactionCount")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserTransactionCount()
        {
            var users = await userRepository.GetUsers(); // Assuming GetUsers() returns a collection of User objects
            var userTransactionCountList = new List<UserTransactionCountDTO>();

            foreach (var user in users)
            {
                var transactionCount = transactionRepository.GetTransactionCount(user.Id);

                var userTransactionCountDTO = new UserTransactionCountDTO
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Address = user.Address,
                    PhoneNumber = user.PhoneNumber,
                    Age = user.Age,
                    TransactionCount = transactionCount
                };

                userTransactionCountList.Add(userTransactionCountDTO);
            }

            return Ok(userTransactionCountList);
        }
        [HttpGet("transactioncount2", Name = "GetUserTransactionCount2")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserTransactionCount2(int page = 1, int pageSize = 50)
        {
            try
            {
                var users = await userRepository.GetUsers(); // Assuming GetUsers() returns a collection of User objects

                // Calculate total number of users
                var totalUsers = users.Count;

                // Calculate the number of users to skip based on page number and page size
                var skip = (page - 1) * pageSize;

                // Get users for the current page
                var pagedUsers = users.Skip(skip).Take(pageSize).ToList();

                var userTransactionCountList = new List<UserTransactionCountDTO>();

                foreach (var user in pagedUsers)
                {
                    var transactionCount = transactionRepository.GetTransactionCount(user.Id);

                    var userTransactionCountDTO = new UserTransactionCountDTO
                    {
                        Id = user.Id,
                        Name = user.Name,
                        Email = user.Email,
                        Address = user.Address,
                        PhoneNumber = user.PhoneNumber,
                        Age = user.Age,
                        TransactionCount = transactionCount
                    };

                    userTransactionCountList.Add(userTransactionCountDTO);
                }

                // Return the paged user data along with total count for pagination on the front end
                return Ok(userTransactionCountList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //generate user with transctions
        [HttpGet("generate", Name = "GenerateUsersWithTransactions")]
        public void  GenerateUsersWithTransactions(int n)
        {
           
            userRepository.GenerateData(n);
        }
        [HttpGet("details", Name = "GetAllPaginatedRoleBased")]
        public async Task<IActionResult> GetAllPaginatedBasedOnRole(int? page = null, int? pageSize = null)
        {
            // Retrieve JWT token from the request cookie
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

            // Check if the user is admin
            var isAdmin = token.Claims.FirstOrDefault(claim => claim.Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" && claim.Value == "Admin") != null;

            if (isAdmin && page.HasValue && pageSize.HasValue && page > 0 && pageSize > 0)
            {
                // Paginate user details if admin
                var users = await userRepository.GetUsers(); // Assuming GetUsers() returns IQueryable<User>
                var pagedUsers = users.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList();
                return Ok(pagedUsers);
            }
            else
            {
                // Return details of the current user or unauthorized if not admin and pagination parameters are missing
                var currentUser = await userRepository.GetUserById(int.Parse(userId));
                if (currentUser == null)
                {
                    return NotFound("User not found!");
                }
                return Ok(currentUser);
            }
        }

        //get that has access only user
        [HttpGet("userMe", Name = "GetUser")]
        public async Task<IActionResult> GetUser()
        {
            // Retrieve JWT token from the request cookie
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

            // Return details of the current user
            var currentUser = await userRepository.GetUserById(int.Parse(userId));
            if (currentUser == null)
            {
                return NotFound("User not found!");
            }
            return Ok(currentUser);
        }

        [HttpGet("dasda", Name = "dasad")]
        public void AddRandomRolesToAllUsers()
        {

            var users = userRepository.GetUsers().Result;
            foreach (var user in users)
            {

                if (user.Password == null)
                {
                    var fakeUser = new Faker("en");
                    user.Password = fakeUser.Internet.Password();
                    userRepository.UpdateUser(user);
                }
            }

        }

    }
}
