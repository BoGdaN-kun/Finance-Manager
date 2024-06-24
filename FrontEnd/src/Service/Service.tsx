interface User {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
}

interface User2 {
    id: string;
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    age: number;
    transactionCount: number;
    Role?: string;
}


//const baseurl = 'https://localhost:7235/api/UserControllerAsync';
const baseurl = 'https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync';
export const getUsers2 = (page: number): Promise<User2[]> => {
    const pageSize = 10; // Number of items per page

    const token = localStorage.getItem('token');

    // Construct request headers
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return fetch(`https://bogdan-mpp.azurewebsites.net/api/UserControllerAsync/details?page=${page}&pageSize=${pageSize}`,
        {
            headers: headers,
            credentials: 'include'
        })
        .then(res => res.json())
        .then((users: User2[]) => {
            if (Array.isArray(users)) {
                // Process array of objects
                console.log(users);
                users.forEach(users => {
                    users.age = Number(users.age);
                });
                return users;
            } else {
                // Process single object
                console.log(users);
                return [users]; // Convert single object to array
            }

        });

};

export const deleteUser = (id: string): Promise<void> => {
    return fetch(`${baseurl}/${id}`, {
        method: 'DELETE'
    }).then(() => {
    });
};

export const getUserById = async (id: string): Promise<User> => {
    const response = await fetch(`${baseurl}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return await response.json();
};

export const updateUser = async (id: string, userData: User): Promise<void> => {
    await fetch(`${baseurl}`, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        credentials: 'include',
        body: JSON.stringify(userData)
    });
};
export const createUser = async (userData: User): Promise<void> => {
    await fetch(`${baseurl}`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    });
};