import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // Import this to extend Jest's expect functionality

import Create from '../Components/User/Create';
import {BrowserRouter, Route, Routes, useNavigate} from 'react-router-dom';
import Home from "../Components/User/Home";
import {afterEach} from "@jest/globals";

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));


describe('Create component', () => {
    beforeEach(() => {
        // Reset mocked fetch implementation before each test
        jest.restoreAllMocks();
    });

    afterEach(() => {
        // Clean up any side effects after each test
        jest.clearAllMocks();
    });

    it('should render all input fields and a submit button', () => {
        render(<Create />);
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Age')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Add User' })).toBeInTheDocument();
    });

    it('should submit form with user data', async () => {
        // Mock fetch function
        global.fetch = jest.fn().mockResolvedValueOnce({});

        render(<Create />);

        // Fill out form fields
        fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john.doe@example.com' } });
        fireEvent.change(screen.getByLabelText('Address'), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByLabelText('Phone Number'), { target: { value: '555-123-4567' } });
        fireEvent.change(screen.getByLabelText('Age'), { target: { value: '20' } });

        // Submit form
        fireEvent.click(screen.getByRole('button', { name: 'Add User' }));

        // Expect fetch to be called with correct arguments
        expect(fetch).toHaveBeenCalledWith('http://localhost:8000/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john.doe@example.com',
                address: '123 Main St',
                phoneNumber: '555-123-4567',
                age: 20
            }),
        });














        // Expect navigation after successful submission
        await waitFor(() => {
            expect(useNavigate).toHaveBeenCalled();
        });

        const mockUsers = [
            { id: 1, name: 'John Doe', email: 'john.doe@example.com', address: '123 Main St', phoneNumber: '555-123-4567', age: 30 },
            { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', address: '456 Elm St', phoneNumber: '555-789-0123', age: 25 },
        ];

        jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify(mockUsers)));

        render(
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </BrowserRouter>
        );

        await waitFor(() => {
            const tableRows = screen.getAllByRole('row');
            expect(tableRows.length).toBe(mockUsers.length + 1); // +1 for header row
        });

        const tableRows = screen.getAllByRole('row');
        expect(tableRows.length).toBe(mockUsers.length + 1);

    });
});
