using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebApplication1.Datacontext;
using WebApplication1.Interfaces;
using WebApplication1.Model;
using WebApplication1.Repository;

namespace WebApplication1.Hubs
{
    public class UserHub : Hub
    {
        private readonly IUserRepositoryAsync _userRepositoryAsync;
        private readonly DataContext _context;

        public UserHub(IUserRepositoryAsync userRepository,DataContext context)
        {
            _userRepositoryAsync = userRepository;
            _context = context;
        }
        public override async Task OnConnectedAsync()
        {
            var users = await _userRepositoryAsync.GetUsers();
           
            await Clients.All.SendAsync("ReceiveMessage", $"{Context.ConnectionId} joined the hub");
        }
        

    }
}
