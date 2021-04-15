import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Login = ({ checkAuth, showToast }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (username.length && password.length) {
            try {
                const response = await axios.post("/login", {
                    username,
                    password,
                });

                if (response.data.isAuthenticated) {
                    await checkAuth(response.data);
                    // setUsername("");
                    // setPassword("");
                    history.push("/home");
                } else {
                    showToast("Wrong username or password");
                }


            } catch (error) {
                console.log(error);
            }
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

    const handleEnter = (e) => {
        if (e.code === "Enter") {
            handleLogin(e);
        };
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="card">
                <h1 className="card-header text-center">Flashcards Login</h1>
                <form className="m-2" onSubmit={handleLogin} onKeyPress={handleEnter}>
                    <div className="mb-3 ms-4 me-4">
                        <label htmlFor="username" className="form-label mb-0">Username:</label>
                        <input type="text"className="form-control" name="username" value={username} onChange={handleInput}/>
                    </div>
                    <div className="mb-3 ms-4 me-4">
                        <label htmlFor="password" className="form-label mb-0">Password:</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={handleInput}/>
                    </div>
                    <div className="d-flex justify-content-between ms-4 me-4">
                        <input type="submit" className="btn btn-primary text-center" value="Login" />
                        <input type="button" className="btn btn-primary" value="Create Account" onClick={() => {history.push("/signup")}}/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;