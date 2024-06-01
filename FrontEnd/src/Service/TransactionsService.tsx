import {Transaction} from "../Domain/Transaction";

const baseUrl = 'https://bogdan-mpp.azurewebsites.net/api/TransactionControllerAsync';


export const getTransactions2 = async (page: number) => {
    const pageSize = 20; // Number of items per page
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return fetch(`https://bogdan-mpp.azurewebsites.net/api/TransactionControllerAsync/detailsTransaction?page=${page}&pageSize=${pageSize}`,
        {
            headers: headers,
            credentials: 'include'
        })
        .then(res => res.json())
        .then((transactions: Transaction[]) => {
            // Sort the transactions by date in descending order
            transactions.sort((a, b) => {
                // Compare date strings directly
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            });
            return transactions;
        });
}
export const deleteTransaction = async (id: string) => {
    return fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });
};

export const getTransactionById = async (id: string): Promise<Transaction> => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const response = await fetch(`${baseUrl}/${id}`,
        {headers,credentials: 'include'});
    if (!response.ok) {
        throw new Error('Failed to fetch transaction');
    }
    return await response.json();
}

export const updateTransaction = async (id: string, transactionData: Transaction) => {
    await fetch(`${baseUrl}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify(transactionData)
    });
}

export const createTransaction = async (transactionData: Transaction) => {
    await fetch(baseUrl, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(transactionData)
    });
}
