import React from "react";
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
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
    const navigate = useNavigate();

    const handleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        const user = {name, email, address, phoneNumber, age};

        try {
            const response = await fetch('https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync', {
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
            // Add id field to user object

            //const userWithId = { id, ...user};
            const userWithId = {id, ...user, transactionCount: 0};

            // Retrieve local changes from storage
            const localChanges = JSON.parse(localStorage.getItem('users') || '[]');
            // Push the user object with id to local changes
            localChanges.push(userWithId);
            // Update local storage with new local changes

            localStorage.setItem('users', JSON.stringify(localChanges));

            const query = {
                url: 'https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync',
                type: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(user),
                credentials: 'include'
            };
            const queries = JSON.parse(localStorage.getItem('queries') || '[]');
            queries.push(query);
            localStorage.setItem('queries', JSON.stringify(queries));
            //localStorage.setItem('queries', JSON.stringify({url :'https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync' , type:'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(userWithId)}));

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
