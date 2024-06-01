import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Button, MenuItem, Select, Snackbar, TextField} from "@mui/material";

interface ErrorType {
    message: string;
}

interface SimpleUserDTO {
    id: string,
    name: string
}

function TransactionCreate() {
    const [amount, setAmount] = React.useState(0);
    const [date, setDate] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [userId, setUserId] = React.useState('');
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>('');
    const [users, setUsers] = useState<SimpleUserDTO[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetchSimepleUserDTO()
    }, []);

    const fetchSimepleUserDTO = async () => {
        try {
            const response = await fetch('https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync/idname',{credentials: 'include'});
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            setUsers(data);
        }catch (error:any){
            console.error('Error fetching users:', error);
            setSnackbarMessage(`Error adding transaction: ${error.message}`);
            setSnackbarOpen(true);
        }
    }

    const hamdleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        const transaction = {amount, date, description, category, userId};

        try {
            const response = await fetch('https://bogdan-mpp.azurewebsites.net/api/TransactionControllerAsync', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                credentials: 'include',
                body: JSON.stringify(transaction)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('New transaction added');
            navigate('/transactions');
        } catch (error: any) {
            console.error('Error adding transaction:', error.message);
            setSnackbarMessage(`Error adding transaction: ${error.message}`);
            setSnackbarOpen(true);
            setTimeout(() => {
                setSnackbarOpen(false);
            }, 5000);
        }
    }
    return (
        <div>
            <h2>Add Transaction</h2>
            <form className="addTransactionForm" onSubmit={hamdleSubmission}>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="amount"
                        label="Amount"
                        variant="outlined"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="date"
                        label="Date"
                        variant="outlined"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="category"
                        label="Category"
                        variant="outlined"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <TextField
                        id="userId"
                        label="User ID"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <div style={{marginBottom: "10px"}}>
                    <Select
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value as string)}
                        variant="outlined"
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select User
                        </MenuItem>
                        {users.map(user => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Add Transaction
                </Button>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={() => setSnackbarOpen(false)}
                message={"Error in adding the Transaction"}
            />
        </div>
    )
}

export default TransactionCreate;