/*using FakeItEasy;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApplication1.Controllers;
using WebApplication1.Interfaces;
using WebApplication1.Model;
using WebApplication1.Repository;

namespace WebApplication1.Tests.Controller
{
    public class UserControllerTests
    {

        [Fact]
        public void UserController_GetAllUsers_ReturnOK()
        {
            //Arrange

            var userRepository = A.Fake<IUserRepository>();
            var fakeUsers = new List<User>
            {
                new User {Id = 1,Address = "das",Age = 20,Email = "dasdas@gmail.com",Name = "das",PhoneNumber = "das"},
                new User {Id = 2,Address = "das",Age = 20,Email = "dasdas@gmail.com",Name = "dadada",PhoneNumber = "123"}

            };



            A.CallTo(() => userRepository.GetUsers()).Returns(fakeUsers);

            var controller = new UserController(userRepository);

            //Act

            var result = controller.GetAllUsers();

            //Assert

            result.Should().NotBeNull();
            result.Should().BeOfType(typeof(OkObjectResult));
        }




        [Fact]
        public void UserController_GetUserById_ReturnOK()
        {
            //Arrange

            var userRepository = A.Fake<IUserRepository>();
            var fakeUser = new User { Id = 1, Address = "das", Age = 20, Email = "das@gmail.com", Name = "das", PhoneNumber = "das" };

            A.CallTo(() => userRepository.GetUserById(1)).Returns(fakeUser);
            var controller = new UserController(userRepository);

            //Act

            var result = controller.GetTransactionByIdAsync(1);
            //Assert

            result.Should().NotBeNull();
            result.Should().BeOfType(typeof(OkObjectResult));

        }


        [Fact]

        public void UserController_AddUser_ReturnOK()
        {
            //Arrange 
            var userRepository = A.Fake<IUserRepository>();
            var fakeUser = new User { Id = 3, Address = "das", Name = "User 1", Age = 20, Email = "sdadas@gmail.com", PhoneNumber = "dsada" };

            A.CallTo(() => userRepository.AddUser(fakeUser)).DoesNothing();

            var controller = new UserController(userRepository);

            //Act

            var result = controller.AddUser(fakeUser);

            //Assert
            var actionResult = Assert.IsType<CreatedAtRouteResult>(result);
            Assert.Equal("GetUserById", actionResult.RouteName);
            Assert.Equal(fakeUser.Id, actionResult.RouteValues["id"]);
            Assert.Equal(fakeUser, actionResult.Value);


            var actionResult2 = result.Should().BeOfType<CreatedAtRouteResult>().Subject;
            actionResult2.RouteName.Should().Be("GetUserById");
            actionResult2.RouteValues["id"].Should().Be(fakeUser.Id);
            actionResult2.Value.Should().Be(fakeUser);
        }

        [Fact]
        public void AddUser_ReturnsBadRequest_WhenExceptionOccurs()
        {
            // Arrange
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.AddUser(A<User>._)).Throws(new Exception("Some error"));

            var controller = new UserController(userRepository);
            var user = new User { Id = 3, Address = "das", Name = "User 1", Age = 20, Email = "sdadas@gmail.com", PhoneNumber = "dsada" };

            // Act
            var result = controller.AddUser(user);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Some error", badRequestResult.Value);
        }

        [Fact]
        public void UpdateUser_ReturnOK()
        {
            //Arrange

            var userRepository = A.Fake<IUserRepository>();
            var updatedUser = new User { Id = 1, Address = "das", Age = 35, Email = "dasdas@gmail.com", Name = "John", PhoneNumber = "das" }; // Updated user with new properties
            A.CallTo(() => userRepository.UpdateUser(updatedUser)).DoesNothing();
            A.CallTo(() => userRepository.GetUserById(updatedUser.Id)).Returns(updatedUser); // Mock the repository to return the updated user



            var controller = new UserController(userRepository);

            //Act

            var result = controller.UpdateUser(updatedUser);

            //Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var returnedUser = Assert.IsType<User>(actionResult.Value);
            Assert.Equal(updatedUser, returnedUser);
            result.Should().NotBeNull();
            result.Should().BeOfType(typeof(OkObjectResult));


        }

        [Fact]
        public void UpdateUser_ReturnsBadRequest_WhenExceptionOccurs()
        {
            // Arrange
            var userRepository = A.Fake<IUserRepository>();
            var updatedUser = new User { Id = 1, Address = "das", Age = 35, Email = "dasdas@gmail.com", Name = "John", PhoneNumber = "das" }; // Updated user with new properties
            A.CallTo(() => userRepository.UpdateUser(updatedUser)).Throws(new Exception("Some error"));

            var controller = new UserController(userRepository);

            // Act
            var result = controller.UpdateUser(updatedUser);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Some error", badRequestResult.Value);
        }


        [Fact]
        public void DeleteUser_ReturnOK()
        {
            //Arrange
            var userRepository = A.Fake<IUserRepository>();
            var deletedUser = 1;
            A.CallTo(() => userRepository.DeleteUser(deletedUser)).Returns(true);

            var controller = new UserController(userRepository);

            //Act

            var result = controller.DeleteUser(deletedUser);

            //Assert
            Assert.IsType<NoContentResult>(result);
        }


        [Fact]
        public void DeleteUser_ReturnsNotFound_WhenUserNotFound()
        {
            // Arrange
            var userRepository = A.Fake<IUserRepository>();
            A.CallTo(() => userRepository.GetUserById(A<int>._)).Returns(null);

            var controller = new UserController(userRepository);
            var userId = 1;

            // Act
            var result = controller.DeleteUser(userId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("User not found!", notFoundResult.Value);
        }
        [Fact]
        public void DeleteUser_ReturnsBadRequest_WhenExceptionOccurs()
        {
            // Arrange
            var userRepository = A.Fake<IUserRepository>();
            var userId = 1;
            A.CallTo(() => userRepository.GetUserById(userId)).Returns(new User { Id = userId });
            A.CallTo(() => userRepository.DeleteUser(userId)).Throws(new Exception("Some error"));

            var controller = new UserController(userRepository);

            // Act
            var result = controller.DeleteUser(userId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Some error", badRequestResult.Value);
        }
    }
}
*/