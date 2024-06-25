import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from "@mui/material";
import  {getUserById} from "../../Service/UserService";
import {User} from "../../Interfaces/IUser";


function UserDetails() {
    const {id} = useParams();
    const [data, setData] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // Specify type explicitly

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {

            try {
                const user = await getUserById(id);
                setData(user);
            } catch (error) {
                console.error("Error fetching user from server:", error);
                const localStorageData = localStorage.getItem("users");
                if (localStorageData) {
                    const users = JSON.parse(localStorageData);
                    const user = users.find((user: any) => user.id == id);
                    if (user) {
                        setData(user);
                    } else {
                        throw new Error("User not found in local storage");
                    }
                } else {
                    throw new Error("User data not found in local storage");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);


    return (
        <div className="userDetails">
            <h2>User Details</h2>
            {/* loading spinner while data is fetched */}
            {loading && <CircularProgress/>}
            {error && <h1>Error: {error}</h1>}
            {!loading && data && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Age</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={data.id}>
                                <TableCell>{data.name}</TableCell>
                                <TableCell>{data.email}</TableCell>
                                <TableCell>{data.address}</TableCell>
                                <TableCell>{data.phoneNumber}</TableCell>
                                <TableCell>{data.age}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default UserDetails;
