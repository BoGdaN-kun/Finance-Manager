// Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Snackbar } from '@mui/material';

interface User {
    email: string;
    password: string;
    name: string;
    address: string;
    phoneNumber: string;
    age: number;
}

function RegisterComponent() {
    const [user, setUser] = useState<User>({
        email: '',
        password: '',
        name: '',
        address: '',
        phoneNumber: '',
        age: 0
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (user.password !== confirmPassword) {
                setError("Passwords don't match");
                setOpenSnackbar(true);
                return;
            }

            const response = await fetch('https://bogdan-mpp.azurewebsites.net/api/UserLogin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                // Redirect to login page after successful registration
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred during registration');
            setOpenSnackbar(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Register</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <TextField
                            type="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            label="Confirm Password"
                            variant="outlined"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Address"
                            variant="outlined"
                            fullWidth
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Phone Number"
                            variant="outlined"
                            fullWidth
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="number"
                            label="Age"
                            variant="outlined"
                            fullWidth
                            name="age"
                            value={user.age}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            Already have an account? <Link to="/login">Login</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={error}
            />
        </Container>
    );
}

export default RegisterComponent;
