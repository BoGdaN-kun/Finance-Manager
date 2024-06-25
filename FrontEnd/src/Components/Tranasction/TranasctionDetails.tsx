import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ITransaction} from "../../Interfaces/ITransaction";
import {getTransactionById} from "../../Service/TransactionsService";
import {CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";


function TranasctionDetails() {
    const {id} = useParams<{ id: string }>();
    const [transaction, setTransaction] = useState<ITransaction>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null); // Specify type explicitly

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const transactionReq = await getTransactionById(id);
                setTransaction(transactionReq);
            } catch (error) {
                console.error('Error fetching user:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            <h1>Tranasction Details</h1>
            {loading && <CircularProgress/>}
            {error && <h1>Error: {error}</h1>}
            {!loading && transaction && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Amount</TableCell>
                                <TableCell>Transaction Date</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>User Id</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>{transaction.userId}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    )
}

export default TranasctionDetails;