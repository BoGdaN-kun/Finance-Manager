import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ITransaction} from "../../Interfaces/ITransaction";
import {getTransactionById, updateTransaction} from "../../Service/TransactionsService";
import {Button, TextField} from "@mui/material";


function TransactionEdit() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [Transaction, setTransaction] = useState<ITransaction>();
    const [amount, setAmount] = useState(0);
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const transaction = await getTransactionById(id);
                    setTransaction(transaction);
                    setAmount(transaction.amount);
                    setDate(transaction.date);
                    setDescription(transaction.description);
                    setCategory(transaction.category);
                    setUserId(transaction.userId);
                }
            } catch (error) {
                console.error('Error fetching transaction:', error);
            }
        };

        fetchData();
    }, [id]);
    const handleSubmission = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!id) return;
        const updatedTransaction: ITransaction = {
            id:id,
            amount,
            date,
            description,
            category,
            userId,
        };
        try {
            await updateTransaction(id, updatedTransaction);
            setTransaction(updatedTransaction);
            console.log('ITransaction updated');
            navigate('/transactions');

        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    }
    return (
        <div style={{marginTop: "20px"}}>
            <h2>Transaction Edit</h2>
            <form className="editTransactionForm" onSubmit={handleSubmission}>
                <div>
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
                        label="UserId"
                        variant="outlined"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
                <Button type="submit" variant="contained" color="primary">
                    Save
                </Button>

            </form>
        </div>
    )
}

export default TransactionEdit;