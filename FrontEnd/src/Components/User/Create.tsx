import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {TextField, Button, Snackbar} from "@mui/material";

interface ErrorType {
    message: string;
}

function Create() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [age, setAge] = React.useState(0);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
    const navigate = useNavigate();

    const handleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setSnackbarMessage('Passwords do not match');
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 5000);
            return;
        }

        const user = {name, email, address, phoneNumber, age, password};

        try {
            const url = `${process.env.REACT_APP_API_URL}/api/User`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(user)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('New user added');
            navigate('/');
        } catch (error: any) {
            console.error('Error adding user:', error.message);

            // Generate a unique identifier
            const id = Date.now().toString();
            const userWithId = {id, ...user, transactionCount: 0};

            // Retrieve local changes from storage
            const localChanges = JSON.parse(localStorage.getItem('users') || '[]');
            // Push the user object with id to local changes
            localChanges.push(userWithId);
            // Update local storage with new local changes

            localStorage.setItem('users', JSON.stringify(localChanges));

            const query = {
                url: `${process.env.REACT_APP_API_URL}/api/User`,
                type: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user),
                credentials: 'include'
            };
            const queries = JSON.parse(localStorage.getItem('queries') || '[]');
            queries.push(query);
            localStorage.setItem('queries', JSON.stringify(queries));

            setSnackbarMessage(`Error adding user: ${error.message}`);
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 5000);
        }
    };

    return (
        <div>
            <h2>Add User</h2>
            <form className="addUserForm" onSubmit={handleSubmission}>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="address"
                        label="Address"
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="age"
                        label="Age"
                        variant="outlined"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" variant="contained" color="primary">
                    Add User
                </Button>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={"Error in adding the User"}
            />
        </div>
    )
}

export default Create;
