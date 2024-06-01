import React from 'react';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import Home from '../Components/User/Home';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('Home component', () => {
    beforeEach(() => {
        // Reset mocked fetch implementation before each test
        jest.restoreAllMocks();
    });

    afterEach(() => {
        // Clean up any side effects after each test
        jest.clearAllMocks();
    });

    it('should render user data when fetched successfully', async () => {
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                address: '123 Main St',
                phoneNumber: '555-123-4567',
                age: 18
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                address: '456 Elm St',
                phoneNumber: '555-789-0123',
                age: 19
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(mockUsers)));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        );

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            expect(tableRows.length).toBe(mockUsers.length + 1); // +1 for header row
        });

        const tableRows = screen.getAllByRole('row');
        expect(tableRows.length).toBe(mockUsers.length + 1);

        mockUsers.forEach((user) => {
            const userRow = screen.getByText(user.name);
            expect(userRow).toBeInTheDocument();
        });

        const johnDoeRow = screen.getByText('John Doe');
        expect(johnDoeRow).toBeInTheDocument();

        const janeSmithRow = screen.getByText('Jane Smith');
        expect(janeSmithRow).toBeInTheDocument();
    });

    it('should delete a user', async () => {
        const mockUsers = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com',
                address: '123 Main St',
                phoneNumber: '555-123-4567',
                age: 18
            },
            {
                id: 2,
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                address: '456 Elm St',
                phoneNumber: '555-789-0123',
                age: 19
            },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(mockUsers)));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        );

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            expect(tableRows.length).toBe(mockUsers.length + 1); // +1 for header row
        });
        const confirmationSpy = jest.spyOn(window, 'confirm').mockReturnValueOnce(true);
        jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(mockUsers)));

        fireEvent.click(screen.getAllByText('Delete')[0]);
        expect(confirmationSpy).toHaveBeenCalledWith('Are you sure you want to delete this User?');
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/users/1', {
            method: 'DELETE'
        });

        await waitFor(() => {
            const remainingUsers = screen.getAllByRole('row');
            expect(remainingUsers.length).toBe(mockUsers.length); // One less user after deletion
            //expect(remainingUsers.length).toBe(mockUsers.length - 1); // One less user after deletion
        });
    });
});
