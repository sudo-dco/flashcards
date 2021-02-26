import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = ({ changeAuth }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username.length && password.length) {
            axios.post("/login", {
                username,
                password
            })
            .then((response) => {
                if (response.data.isAuthenticated) {
                    changeAuth(true);
                    history.push("/home");
                }
            })
            .catch((error) => {
                console.log(error);
            })
    
            setUsername("");
            setPassword("");
        }
    };

    const handleInput = ({ target }) => {
        const { value } = target;
        if (target.name === "username") {
            setUsername(value);
        } else if (target.name === "password") {
            setPassword(value);
        }
    };

    return (
        <form onSubmit={handleLogin} onChange={handleInput}>
            <h1>Flashcards Login:</h1>
            <input type="text" name="username" placeholder="username" value={username} />
            <input type="password" name="password" placeholder="password" value={password} />
            <input type="submit" value="Login" />
        </form>
    )
}

export default Login;