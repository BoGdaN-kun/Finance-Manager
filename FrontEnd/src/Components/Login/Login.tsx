// Login.js
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { TextField, Button, Typography, Container, Grid, Snackbar } from '@mui/material';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e : any) => {
        e.preventDefault();
        try {
            const baseurl = `${process.env.REACT_APP_API_URL}/api/UserLogin/login`;
            const response = await fetch(baseurl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });
            console.log(response.status)
            console.log(response)
            if (response.status === 200) {
                const data = await response.json();
                const token = data.token;
                localStorage.setItem('token', token);
                navigate('/');
            } else {
                setError('Invalid email or password');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Login</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <TextField
                            type="text"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            type="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Login
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            Don't have an account? <Link to="/register">Register</Link>
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

export default LoginComponent;
