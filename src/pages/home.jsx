import { useState, useEffect } from "react";
import Post from "../components/Post";

export default function HomePage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function getPosts() {
            console.log("a");
        }
        getPosts();
    }, []);

    return (
        <section className="page">
            <section className="grid-container">
                <Post post={"post"} />
            </section>
        </section>
    );
}