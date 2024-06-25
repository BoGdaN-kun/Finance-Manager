# Finance Manager

Finance Manager is a comprehensive financial management system designed to streamline transaction tracking, provide insightful data visualization, and manage user roles efficiently.

## Description

Finance Manager enables users to track transactions, visualize data through dynamic charts, and manage user roles (admin/manager/regular user) with secure authentication and authorization mechanisms. The system is built with scalability and usability in mind, offering a seamless experience for users across different roles.

```
If you want to deploy this project or just change the domain, you can do that by modifying the .env file
```
## Key Features

- **Transaction Tracking:** Easily track and manage financial transactions.
- **Data Visualization:** Visualize transaction data through dynamic charts.
- **User Role Management:** Administer user roles and permissions securely.
- **Authentication and Authorization:** Implement JWT for secure authentication and authorization.

## Technology Stack

- **Backend:** Developed using C# with Entity Framework for efficient database operations.
- **Database:** Utilized SQL Server for data storage and management.
- **Authentication:** Implemented JWT for secure authentication and authorization.
- **Frontend:** Built a React frontend for a seamless user experience.
- **UI Framework:** Utilized Material-UI for building a modern and responsive user interface.

## Installation

1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd BackEnd
   dotnet restore
   dotnet ef database update
   ```
3. Install frontend dependencies:
   ```bash
   cd FrontEnd
   npm install
   ```

## Usage

1. Start the backend server:
   ```bash
   cd BackEnd
   dotnet run
   ```

2. Start the frontend server:
   ```bash
   cd FrontEnd
   npm start
   ```
