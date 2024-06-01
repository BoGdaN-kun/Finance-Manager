import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Edit from '../Components/User/Edit';
import { getUserById, updateUser } from '../Service/Service';

jest.mock('../Service/Service', () => ({
    getUserById: jest.fn(),
    updateUser: jest.fn(),
}));

describe('Edit Component', () => {


    test('renders edit form with user data', async () => {
        render(
            <BrowserRouter>
                <Edit />
            </BrowserRouter>
        );
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Age')).toHaveValue();
        expect(screen.getByText('Update User')).toBeInTheDocument();
    });

});
