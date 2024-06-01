using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Controllers;
using WebApplication1.Datacontext;
using WebApplication1.DTOs;
using WebApplication1.Hubs;
using WebApplication1.Interfaces;
using WebApplication1.Model;

namespace WebApplication1.Repository
{
    public class UserRepositoryAsync : IUserRepositoryAsync
    {
        private readonly IDbContextFactory<DataContext> _contextFactory;
        private readonly GeneratingUsers _generatingUsers = new GeneratingUsers();
        private readonly Timer _timer;
        private readonly IHubContext<UserHub> _hubContext;
        private readonly DbContext context1;
        public UserRepositoryAsync(IDbContextFactory<DataContext> contextFactory, IHubContext<UserHub> hubContext)
        {
            _contextFactory = contextFactory;
            _hubContext = hubContext;
         //   _timer = new Timer(async _ => await AddUsersCallback(), null, TimeSpan.Zero, TimeSpan.FromMinutes(10));
            context1 = contextFactory.CreateDbContext();
        }

        public async Task AddUsersCallback()
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    var userTogen = await _generatingUsers.generateData2(1);
                    context.Users.AddRange(userTogen);
                    await context.SaveChangesAsync();
                }

                await _hubContext.Clients.All.SendAsync("ReceiveMessage", "New user added");
            }
            catch (Exception ex)    
            {
                // Handle exceptions here
                Console.WriteLine($"Error adding users: {ex.Message}");
            }
        }
        public User GetUserByEmail(string email)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    var user = context.Users.FirstOrDefault(u => u.Email == email);
                    
                    return user;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                Console.WriteLine($"Error getting user: {ex.Message}");
                return null;
            }
        }
        public void GenerateData(int n)
        {
           try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    var users = _generatingUsers.GenerateDataWithTransactions(n);
                    context.Users.AddRange(users);
                    context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions here
                Console.WriteLine($"Error generating data: {ex.Message}");
            }
        }


        public async Task AddUser(User user)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                if (string.IsNullOrWhiteSpace(user.Name) ||
                   string.IsNullOrWhiteSpace(user.Email) ||
                   string.IsNullOrWhiteSpace(user.Address) ||
                   string.IsNullOrWhiteSpace(user.PhoneNumber))
                {
                    throw new ArgumentException("All fields are required");
                }
                if (user.Age <= 0)
                {
                    throw new ArgumentException("Age must be greater than 0");
                }

                context.Users.Add(user);
                await context.SaveChangesAsync();
            }
        }

        public async Task<bool> DeleteUser(int id)
        {
            using (var context = _contextFactory.CreateDbContext())
            {
                var user = await context.Users.FindAsync(id);
                if (user != null)
                {
                    context.Users.Remove(user);
                    await context.SaveChangesAsync();
                    return true;
                }
                return false;
            }

        }

        public async Task<ICollection<User>> GetUsers()
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    return await context.Users.ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<User> GetUserById(int id)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    return await context.Users.FindAsync(id);
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        public async Task<List<IdNameDTO>> GetIdName()
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    return await context.Users.Select(u => new IdNameDTO { Id = u.Id, Name = u.Name }).ToListAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task UpdateUser(User user)
        {
            try
            {
                using (var context = _contextFactory.CreateDbContext())
                {
                    context.Users.Update(user);
                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
