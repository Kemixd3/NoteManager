import { NavLink } from "react-router-dom";

export default function Nav() {
    return (
        <nav>
            <NavLink to="/">Posts</NavLink>
            <NavLink to="/create">Create</NavLink>
        </nav>
    );
}