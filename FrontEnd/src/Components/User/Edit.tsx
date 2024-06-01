import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TextField, Button} from "@mui/material";
import {getUserById, updateUser} from "../../Service/Service";

interface UserData {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
    transactionCount?: number;
}

function Edit() {
    const {id} = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState(0);
    const [transactionCount, setTransactionCount] = useState(0);
    useEffect(() => {
        const fetchDataForForm = async () => {
            try {
                if (id) { // Check if id is not undefined
                    const user = await getUserById(id);
                    setUserData(user);
                    setName(user.name);
                    setEmail(user.email);
                    setAddress(user.address);
                    setPhoneNumber(user.phoneNumber);
                    setAge(user.age);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                // If fetching user fails, try fetching from local storage
                const localStorageData = localStorage.getItem("users");
                if (localStorageData) {
                    const users: UserData[] = JSON.parse(localStorageData);
                    const user = users.find((user) => user.id == id);
                    if (user) {
                        setUserData(user);
                        setName(user.name);
                        setEmail(user.email);
                        setAddress(user.address);
                        setPhoneNumber(user.phoneNumber);
                        setAge(user.age);
                        setTransactionCount(user.transactionCount || 0);
                        localStorage.setItem("users", JSON.stringify(users));
                    } else {
                        console.error("User not found in local storage");
                    }
                } else {
                    console.error("User data not found in local storage");
                }
            }
        };

        fetchDataForForm();
    }, [id]);

    const handleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!id) return; // Exit early if id is undefined
        const updatedUser: UserData = {
            id: userData ? userData.id : '', // Ensure id is string
            name,
            email,
            address,
            phoneNumber,
            age, // Ensure age is number
        };

        try {
            await updateUser(id, updatedUser);
            console.log('User updated');
            navigate('/');
        } catch (error) {
            console.error("Error updating user:", error);
            // If updating user fails, update local storage
            const localStorageData = localStorage.getItem("users");
            if (localStorageData) {
                const users: UserData[] = JSON.parse(localStorageData);
                const updatedUsers = users.map((user) =>
                    user.id == id ? updatedUser : user
                );
                localStorage.setItem("users", JSON.stringify(updatedUsers));
                // Store URL and user data in local storage
                const query = {
                    url: 'https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync',
                    type: 'PUT',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedUser)
                };
                const queries = JSON.parse(localStorage.getItem('queries') || '[]');
                queries.push(query);
                localStorage.setItem('queries', JSON.stringify(queries));
            }
            navigate('/');
        }
    };

    return (
        <div style={{marginTop: "20px"}}>
            <h2>Edit User</h2>
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
                    Update User
                </Button>
            </form>
        </div>
    );
}

export default Edit;
