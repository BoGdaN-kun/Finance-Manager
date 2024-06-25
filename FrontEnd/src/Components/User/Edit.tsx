import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { getUserById, updateUser } from "../../Service/UserService";
import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, setUsers } from "../../Redux/Slices/UserReducer";
import { HomeUser } from "../../Interfaces/IUser";

interface UserData {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
    password?: string;
    transactionCount?: number;
}

function Edit() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.user.users);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState(0);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [transactionCount, setTransactionCount] = useState(0);

    useEffect(() => {
        const fetchDataForForm = async () => {
            try {
                if (id) {
                    dispatch(setLoading(true));
                    const user = await getUserById(id);
                    setName(user.name);
                    setEmail(user.email);
                    setAddress(user.address);
                    setPhoneNumber(user.phoneNumber);
                    setAge(user.age);
                    dispatch(setUsers([user]));
                    dispatch(setLoading(false));
                    dispatch(setError(null));
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                const localStorageData = localStorage.getItem("users");
                if (localStorageData) {
                    const users: UserData[] = JSON.parse(localStorageData);
                    const user = users.find((user) => user.id === id);
                    if (user) {
                        setName(user.name);
                        setEmail(user.email);
                        setAddress(user.address);
                        setPhoneNumber(user.phoneNumber);
                        setAge(user.age);
                        setTransactionCount(user.transactionCount || 0);
                    } else {
                        console.error("User not found in local storage");
                    }
                } else {
                    console.error("User data not found in local storage");
                }
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchDataForForm();
    }, [id, dispatch]);

    const handleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!id) return;

        const updatedUser: UserData = {
            id,
            name,
            email,
            address,
            phoneNumber,
            age,
            password,
            transactionCount,
        };

        try {
            await updateUser(id, updatedUser);
            console.log('User updated');

            // Update the user in the Redux store
            const updatedUsers = users.map((user) =>
                user.id === id ? { ...user, ...updatedUser } : user
            );
            dispatch(setUsers(updatedUsers));

            navigate('/');
        } catch (error) {
            console.error("Error updating user:", error);

            // If updating user fails, update local storage
            const localStorageData = localStorage.getItem("users");
            if (localStorageData) {
                const users: UserData[] = JSON.parse(localStorageData);
                const updatedUsers = users.map((user) =>
                    user.id === id ? updatedUser : user
                );
                localStorage.setItem("users", JSON.stringify(updatedUsers));

                // Add failed update request to queries queue in local storage
                const query = {
                    url: `${process.env.REACT_APP_API_URL}/api/User/${id}`,
                    type: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedUser),
                };
                const queries = JSON.parse(localStorage.getItem('queries') || '[]');
                queries.push(query);
                localStorage.setItem('queries', JSON.stringify(queries));
            }
            navigate('/');
        }
    };

    return (
        <div style={{ marginTop: "20px" }}>
            <h2>Edit User</h2>
            <form className="addUserForm" onSubmit={handleSubmission}>
                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="name"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="email"
                        label="Email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="address"
                        label="Address"
                        variant="outlined"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="phoneNumber"
                        label="Phone Number"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="age"
                        label="Age"
                        variant="outlined"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="password"
                        label="Password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <TextField
                        id="confirmPassword"
                        label="Confirm Password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <Button type="submit" variant="contained" color="primary">
                    Update User
                </Button>
            </form>
        </div>
    );
}

export default Edit;
