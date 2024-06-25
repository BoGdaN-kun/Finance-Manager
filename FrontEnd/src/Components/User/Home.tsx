import React, {useState, useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Snackbar
} from "@mui/material";
import {deleteUser, getUsers} from "../../Service/UserService";
import AgePieChart from "./Chart";
import * as signalR from "@microsoft/signalr";
import {HomeUser} from "../../Interfaces/IUser";
import {RootState} from "../../Redux/store";
import {useDispatch, useSelector} from "react-redux";
import {deleteUserLocally, setLoading, setUsers} from "../../Redux/Slices/UserReducer";



function Home() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.user.users);
    const loading = useSelector((state: RootState) => state.user.loading);
    const error = useSelector((state: RootState) => state.user.error);
    const [page, setPage] = useState(1);
    const tableEndRef = useRef<HTMLDivElement>(null);
    const [offlineWarning, setOfflineWarning] = useState(false);
    const [serverDownWarning, setServerDownWarning] = useState(false);
    const [onlineStatus, setOnlineStatus] = useState(true);
    const syncNewEntitiesWithServer = async () => {
        try {

            // Retrieve the array of queries from local storage
            const queries = JSON.parse(localStorage.getItem('queries') || '[]');

            if (!Array.isArray(queries)) {
                throw new Error('Queries data is not in the correct format');
            }

            if (queries.length === 0) {
                console.log('No queries to sync with server');
                return;
            }

            // Iterate over each query and send it to the server
            for (const query of queries) {
                try {
                    const {url, type, headers, body} = query;
                    const response = await fetch(url, {
                        method: type,
                        headers,
                        body: body
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to sync query with server: ${JSON.stringify(query)}`);
                    }

                    // Remove the synced query from local storage
                    const updatedQueries = queries.filter(q => q !== query);
                    localStorage.setItem('queries', JSON.stringify(updatedQueries));

                } catch (queryError: any) {
                    console.error('Error syncing query with server:', queryError.message);
                }
            }

            console.log('Queries synced with server successfully');
        } catch (error: any) {
            console.error('Error syncing queries with server:', error.message);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(setLoading(true));
                const data = await getUsers(page);
                const filteredData = data.filter((newUser) => !users.some((existingUser) => existingUser.id === newUser.id));
                const updatedUsers = [...users, ...filteredData];
                dispatch(setUsers(updatedUsers));
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                setOfflineWarning(false);
                setServerDownWarning(false);
            } catch (error) {
                if (!navigator.onLine) {
                    setOfflineWarning(true);
                    setOnlineStatus(false);

                    localStorage.setItem("users", JSON.stringify(users));
                    setTimeout(() => setOfflineWarning(false), 10000);
                } else {
                    setOnlineStatus(false);
                    setServerDownWarning(true);

                    localStorage.setItem("users", JSON.stringify(users));
                    setTimeout(() => setServerDownWarning(false), 10000);
                }
            }
            finally {
                dispatch(setLoading(false));
            }
        };

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}/userHub`)
            .withAutomaticReconnect()
            .build();

        connection.start().then(() => {
            setServerDownWarning(false);
            setOnlineStatus(true);
            syncNewEntitiesWithServer().then(r => fetchData());
            console.log("SignalR connected.");
        }).catch(err => {
            console.error('SignalR connection error:', err);
            setServerDownWarning(true);
        });

        connection.on("SendUsers", (updatedUsers: HomeUser[]) => {
            /*setUsers(prevUsers => [...prevUsers, ...updatedUsers]);*/
            dispatch(setUsers(updatedUsers));
        });

        const handleConnectionChange = () => {
            if (!navigator.onLine) {
                setOfflineWarning(true);
                setTimeout(() => setOfflineWarning(false), 4000);
            } else {
                setOnlineStatus(true);
            }
        };

        window.addEventListener("online", () => setOfflineWarning(false));
        window.addEventListener("offline", handleConnectionChange);

        return () => {
            connection.stop();
            window.removeEventListener("online", () => setOfflineWarning(false));
            window.removeEventListener("offline", handleConnectionChange);
        };
    }, [page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            {threshold: 0.50}
        );

        if (tableEndRef.current) {
            observer.observe(tableEndRef.current);
        }

        return () => {
            if (tableEndRef.current) {
                observer.unobserve(tableEndRef.current);
            }
        };
    }, []);
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);
    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this User?")) {
            if (navigator.onLine && !serverDownWarning) {
                deleteUser(id)
                    .then(() => {
                        dispatch(deleteUserLocally(id));
                        console.log("User deleted successfully");
                    })
                    .catch((error) => {
                        console.error("Error deleting user:", error);
                    });
            } else {
                const newUsers = users.filter((user) => user.id !== id);
                dispatch(deleteUserLocally(id));
                localStorage.setItem("users", JSON.stringify(newUsers));
                const queries = JSON.parse(localStorage.getItem('queries') || '[]');
                const deleteQuery = {
                    url: `${process.env.REACT_APP_API_URL}/${id}`,
                    type: 'DELETE',
                    headers: {"Content-Type": "application/json"},
                    body: null
                };
                queries.push(deleteQuery);
                localStorage.setItem('queries', JSON.stringify(queries));

                console.log("User data deleted from local storage");
            }
        }
    };

    return (
        <div className="Users">
            <h1>All Users</h1>
            <Link to={`/create`}>
                <Button variant="contained" color="primary" size="small">
                    Add User
                </Button>
            </Link>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Transaction Count</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>{user.age}</TableCell>
                                <TableCell>{user.transactionCount}</TableCell>
                                <TableCell>
                                    <Link to={`/edit/${user.id}`}>
                                        <Button variant="contained" color="primary" size="small">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(user.id)}
                                        variant="contained"
                                        color="error"
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                    <Link to={`/users/${user.id}`}>
                                        <Button variant="contained" color="primary" size="small">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div ref={tableEndRef}></div>
            </TableContainer>
            <AgePieChart users={users}/>

            <Snackbar
                open={offlineWarning}
                message="Warning: You are offline."
            />
            <Snackbar
                open={serverDownWarning}
                message="Error: Server Down."
            />
        </div>
    );
}

export default Home;
