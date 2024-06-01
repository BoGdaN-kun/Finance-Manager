using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication1.DTOs;
using WebApplication1.Interfaces;
using WebApplication1.Model;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserLogin : ControllerBase
    {
        private readonly IUserRepositoryAsync userRepository;
        private readonly IConfiguration _config;
        public UserLogin(IUserRepositoryAsync _userRepository, IConfiguration config)
        {
            userRepository = _userRepository;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("login")] // Unique route for login
        public ActionResult Login([FromBody] UserLoginDTO userLoginDTO)
        {
            var user = Authenticate(userLoginDTO);
            if (user != null)
            {
                var token = GenerateToken(user);
                //return with token field
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    SameSite = SameSiteMode.None, // Adjust as needed based on your requirements
                    Expires = DateTime.Now.AddMinutes(15), // Same expiration time as the token
                    Secure = true, // Set Secure flag
                };
                Response.Cookies.Append("token", token, cookieOptions);
                return Ok(new { token });
            }

            return NotFound("user not found");
        }

        [AllowAnonymous]
        [HttpPost("register", Name = "RegisterUser")] // Specify route name
        public ActionResult Register([FromBody] UserRegisterDTO userDTO)
        {
            var user = new User
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                Address = userDTO.Address,
                PhoneNumber = userDTO.PhoneNumber,
                Age = userDTO.Age,
                Password = userDTO.Password,
                Role = "User"
            };
            userRepository.AddUser(user);
            return CreatedAtRoute("RegisterUser", new { id = user.Id }, user);
        }

        private string GenerateToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JwtSettigns:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier,user.Name),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim("UserId",user.Id.ToString())
            };
            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);

        }

        private  User Authenticate(UserLoginDTO userLogin)
        {
            var currentUser =  userRepository.GetUserByEmail(userLogin.Email);   
            if (currentUser != null)
            {
                return currentUser;
            }
            return null;
        }
    }
}
