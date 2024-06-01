using Microsoft.AspNetCore.SignalR;
using System.Collections;
using WebApplication1.Controllers;
using WebApplication1.Hubs;
using WebApplication1.Interfaces;
using WebApplication1.Model;

namespace WebApplication1.Repository
{
    public class UserRepository 
    {
        private  List<User> _users{ get; set; }
        private Timer _timer;
        private readonly GeneratingUsers _generatingUsers;
        int freeId = 0;
        private readonly IHubContext<UserHub> _hubContext;


        public UserRepository(IHubContext<UserHub> hubContext)
        {
            _hubContext = hubContext;
            _users = new List<User>();
            _generatingUsers = new GeneratingUsers();
            _users = _generatingUsers.generateData(20);
            _timer = new Timer(AddUsers, null, TimeSpan.Zero, TimeSpan.FromSeconds(10)); // Change the interval as needed
            _hubContext = hubContext;
        }

      

        private void AddUsers(object state)
        {
            List<User> newUsers = _generatingUsers.generateData(20);
            foreach (var user in newUsers)
            {
                AddUser(user);
            }   
            _hubContext.Clients.All.SendAsync("SendUsers", newUsers);

        }

        public ICollection<User> GetUsers()
        {
            return _users;
        }

        public User GetUserById(int id)
        {
            try
            {
                var user = _users.FirstOrDefault(x => x.Id == id);
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);

            }
        }
        public void AddUser(User user)
        {

            if (string.IsNullOrWhiteSpace(user.Name) ||
                string.IsNullOrWhiteSpace(user.Email) ||
                string.IsNullOrWhiteSpace(user.Address) ||
                string.IsNullOrWhiteSpace(user.PhoneNumber) 
               )
            {
                throw new ArgumentException("All fields are required");
            }
            if(user.Age <= 0)
            {
                throw new ArgumentException("Age must be greater than 0");
            }
            if (_users.Any(u => u.Id == user.Id))
            {
                // Get the maximum ID in the existing users and assign the next available ID
                int maxId = _users.Max(u => u.Id);
                user.Id = maxId + 1;
            }

            
            _users.Add(user);
            _hubContext.Clients.All.SendAsync("SendUsers", user);
        }

        public void UpdateUser(User user)
        {
            var OldUser = _users.FirstOrDefault(x => x.Id == user.Id);
            if (OldUser != null)
            {
                OldUser.Name = user.Name;
                OldUser.Email = user.Email;
                OldUser.Address = user.Address;
                OldUser.PhoneNumber = user.PhoneNumber;
                OldUser.Age = user.Age;
            }

        }

        public bool DeleteUser(int id)
        {
            try
            {
                var user = _users.FirstOrDefault(x => x.Id == id);
                if (user != null)
                {
                    freeId = user.Id;
                    _users.Remove(user);
                    return true;
                }
                else
                {
                    return false; 
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
