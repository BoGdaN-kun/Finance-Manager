import React from 'react';
import {render, screen} from '@testing-library/react';
import UserDetails from '../Components/User/UserDetails';
import {BrowserRouter} from 'react-router-dom';

describe('UserDetails component', () => {
    it('should render user details when data is fetched successfully', async () => {
        const mockUserData = {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            address: '123 Main St',
            phoneNumber: '555-123-4567',
            age: 18
        };

        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => mockUserData,
        } as any); // Mocking fetch response

        render(
            <BrowserRouter>
                <UserDetails/>
            </BrowserRouter>
        );

        expect(screen.getByText('User Details')).toBeInTheDocument(); // Check if heading is rendered



        await screen.findByText(mockUserData.name);
        expect(screen.getByText(mockUserData.name)).toBeInTheDocument();
        expect(screen.getByText(mockUserData.email)).toBeInTheDocument();
        expect(screen.getByText(mockUserData.address)).toBeInTheDocument();
        expect(screen.getByText(mockUserData.phoneNumber)).toBeInTheDocument();
        expect(screen.getByText(mockUserData.age.toString())).toBeInTheDocument();
    });

    it('should display error message if fetching data fails', async () => {

        jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch user'));
        render(
            <BrowserRouter>
                <UserDetails/>
            </BrowserRouter>
        );
        expect(screen.getByText('User Details')).toBeInTheDocument(); // Check if heading is rendered

        await screen.findByText('Error: Failed to fetch user');
        expect(screen.getByText('Error: Failed to fetch user')).toBeInTheDocument(); // Check if error message is rendered
    });
});
