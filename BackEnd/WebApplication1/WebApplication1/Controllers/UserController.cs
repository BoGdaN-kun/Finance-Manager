using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.ObjectModel;
using WebApplication1.Interfaces;
using WebApplication1.Model;
using WebApplication1.Repository;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        
        private readonly IUserRepository userRepository;

        public UserController(IUserRepository _userRepository)
        {
            this.userRepository = _userRepository;
        }


        [HttpGet(Name = "All")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetAllUsers()
        {
            var users = userRepository.GetUsers().ToList();
            return Ok(users);
        }

        [HttpGet("{id:int}", Name = "GetUserById")]
        [ProducesResponseType(200, Type = typeof(User))]
        [ProducesResponseType(400)]
        public IActionResult GetById([FromRoute] int id)
        {
            var user = userRepository.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found!");
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult AddUser([FromBody] User user)
        {
            try
            {
                //user.Id = userRepository.GetUsers().Max(x => x.Id) + 1;
                userRepository.AddUser(user);
                return CreatedAtRoute("GetUserById", new { id = user.Id }, user);
                //return Ok(GetAllUsers());
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                userRepository.UpdateUser(user);
                return Ok(user);
                //return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:int}")]
        public IActionResult DeleteUser([FromRoute] int id)
        {
            try
            {

                var userToDelete = userRepository.GetUserById(id);
                if (userToDelete == null)
                {
                    return NotFound("User not found!");
                }

                userRepository.DeleteUser(userToDelete.Id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
    }
}
