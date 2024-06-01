using System.Collections.ObjectModel;
using WebApplication1.Model;

namespace WebApplication1.Interfaces
{
    public interface IUserRepository
    {
        ICollection<User> GetUsers();
        User GetUserById(int id);
        void AddUser(User user);
        void UpdateUser(User user);
        bool DeleteUser(int id);

    }
}
