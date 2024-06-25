import {HomeUser, User} from "../Interfaces/IUser";
import Home from "../Components/User/Home";


const baseurl = `${process.env.REACT_APP_API_URL}/api/User`;
export const getUsers = (page: number): Promise<HomeUser[]> => {
    const pageSize = 10;

    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    return fetch(`${baseurl}/details?page=${page}&pageSize=${pageSize}`,
        {
            headers: headers,
            credentials: 'include'
        })
        .then(res => res.json())
        .then((users: HomeUser[]) => {
            if (Array.isArray(users)) {
                console.log(users);
                users.forEach(users => {
                    users.age = Number(users.age);
                });
                return users;
            } else {

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
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await fetch(`${baseurl}/${id}`, {
        headers: headers,
        credentials: 'include'
    });
    if (response.status === 404) {
        throw new Error('User not found');
    }
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

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application',
        'Authorization': `Bearer ${token}`
    };

    await fetch(`${baseurl}`, {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(userData)
    });
};