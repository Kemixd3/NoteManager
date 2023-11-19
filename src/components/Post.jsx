import { useNavigate } from "react-router-dom";

export default function Post({ post }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`posts/${post.id}`);
    }

    return (
        <article onClick={handleClick}>
            <h2>hej</h2>
            <p>p</p>
        </article>
    );
}