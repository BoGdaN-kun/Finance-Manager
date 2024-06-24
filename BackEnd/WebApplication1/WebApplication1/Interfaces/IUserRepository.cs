using WebApplication1.DTOs;
using WebApplication1.Model;

namespace WebApplication1.Interfaces
{
    public interface IUserRepository
    {
        Task<ICollection<User>> GetUsers();
        Task<ICollection<User>> GetUsers(int page = 1, int pageSize = 50);
        Task<User> GetUserById(int id);
        User GetUserByEmail(string email);
        Task AddUser(User user);
        Task UpdateUser(User user);
        Task<bool> DeleteUser(int id);
        Task AddUsersCallback();
        Task<List<UserIdNameDto>> GetIdName();
        void GenerateData(int n);
    }
}