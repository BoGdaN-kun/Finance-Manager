using WebApplication1.Datacontext;
using WebApplication1.Model;

namespace WebApplication1.Repository
{
    public class UserRepositoryContext
    {

        private readonly DataContext _context;
        public UserRepositoryContext(DataContext context)
        {
            _context = context;
        }

        public ICollection<User> GetUsers()
        {
            return _context.Users.OrderBy(x => x.Age).ToList();

        }
    }
}
