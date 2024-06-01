import React, {useEffect, useState} from "react";

interface UserData {
    name: string;
    email: string;
    // Add more properties as needed
}

const useFetch = (url: string) => {


    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            fetch(url).then(
                res => {
                    if (!res.ok) {
                        throw Error('Could not fetch the data for that resource')
                    }
                    return res.json();
                }).then(data => {
                setData(data);
                setLoading(false);
            }).catch(err => {
                setLoading(false);
                setError(err.message);

            })
        }, 1000);
    }, [url]);

    return {data, loading, error}
}

export default useFetch;