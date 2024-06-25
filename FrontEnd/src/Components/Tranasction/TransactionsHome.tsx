import {ITransaction} from "../../Interfaces/ITransaction";
import React, {useEffect, useRef, useState} from "react";
import {deleteUser} from "../../Service/UserService";
import {Link} from "react-router-dom";
import {
    Button,
    Paper, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow
} from "@mui/material";
import {deleteTransaction, getTransactions2} from "../../Service/TransactionsService";


function TransactionsHome() {

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [page, setPage] = useState(1);
    const [offlineWarning, setOfflineWarning] = useState(false);
    const [serverDownWarning, setServerDownWarning] = useState(false);
    const tableEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {


        const fetchData = async () => {
            try {
                console.log(`Fetching data for page ${page}`);
                const data = await getTransactions2(page);
                setTransactions(prevTransactions => [...prevTransactions, ...data]);

                setOfflineWarning(false);
                setServerDownWarning(false);
            } catch (error) {
                if (!navigator.onLine) {
                    setOfflineWarning(true);
                    setTimeout(() => setOfflineWarning(false), 4000);
                } else {
                    setServerDownWarning(true);
                    setTimeout(() => setServerDownWarning(false), 4000);
                }
            }
        };
        fetchData()
        const handleConnectionChange = () => {
            if (!navigator.onLine) {
                setOfflineWarning(true);
                setTimeout(() => setOfflineWarning(false), 4000);
            }
        }

        window.addEventListener("online", () => setOfflineWarning(false));
        window.addEventListener("offline", handleConnectionChange);

        return () => {
            window.removeEventListener("online", () => setOfflineWarning(false));
            window.removeEventListener("offline", handleConnectionChange);
        }

    }, [page]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setPage(prevPage => prevPage + 1);
                }
            },
            {threshold: 0.5}
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

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this ITransaction?"))
            deleteTransaction(id).then(() => {
                const newTransactions = transactions.filter((transaction) => transaction.id !== id);
                setTransactions(newTransactions);
            });
    };


    return (
        <div className="Transactiosn">
            <h1>Transactions</h1>
            <Link to={"/transactions/create"}>
                <Button variant="contained" color="primary" size="small">
                    Add Transaction
                </Button>
            </Link>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>UserId</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map(transaction => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.userId}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>
                                    <Link to={`/transactions/edit/${transaction.id}`}>
                                        <Button variant="contained" color="primary" size="small">
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        onClick={() => handleDelete(transaction.id)}
                                        variant="contained"
                                        color="error"
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                    <Link to={`/transactions/details/${transaction.id}`}>
                                        <Button variant="contained" color="primary" size="small">
                                            Details
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div ref={tableEndRef}></div>
            </TableContainer>
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

export default TransactionsHome;