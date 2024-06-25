import {User} from "../Interfaces/IUser";


const pathToJSONFile = "../../localUsers.json";
export async function loadJSONFile(): Promise<any> {
    try {
        const response = await fetch(pathToJSONFile);
        if (!response.ok) {
            throw new Error('Failed to load JSON file');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON file:', error);
        return null;
    }
}

const updateJSONFile = async (newUsers: User[]) => {
    try {
        // Convert the new user data to JSON string
        const jsonData = JSON.stringify(newUsers);

        // Send a POST request to the server to update the JSON file
        const response = await fetch('http://your-server-url/update-json-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        });

        if (response.ok) {
            console.log('JSON file updated successfully.');
        } else {
            console.error('Failed to update JSON file:', response.statusText);
        }
    } catch (error) {
        // @ts-ignore
        console.error('Error updating JSON file:', error.message);
    }
};

export default updateJSONFile;