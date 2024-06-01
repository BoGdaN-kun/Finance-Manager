using WebApplication1.DTOs;
using WebApplication1.Model;

namespace WebApplication1.Interfaces
{
    public interface IUserRepositoryAsync
    {
        Task<ICollection<User>> GetUsers();
        Task<User> GetUserById(int id);
        Task AddUser(User user);
        Task UpdateUser(User user);
        Task<bool> DeleteUser(int id);
        Task AddUsersCallback();
        void GenerateData(int n);
        Task<List<IdNameDTO>> GetIdName();
        User GetUserByEmail(string email);
    }
}
