import { useState, useEffect } from "react";

export default function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function x() {

        }
        getPosts();
    }, []);

    return (

    );
}