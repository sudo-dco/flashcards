import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const Signup = ({ showToast }) => {
    const [creds, setCreds] = useState({
        username: "",
        password: "",
        code: "",
    });
    
    const history = useHistory();

    const handleSignup = (e) => {
        e.preventDefault();

        if (creds.username.length && creds.password.length) {
            axios.post("/signup", {
                username: creds.username,
                password: creds.password,
                code: creds.code,
            })
            .then((response) => {
                const msg = response.data;

                if (msg === "account_created") {
                    history.push("/login");
                } else if (msg === "invalid_code") {
                    showToast("Invalid code entered!");
                } else if (msg === "username_taken") {
                    showToast("Username taken, please try another!")
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }

        setCreds({
            username: "",
            password: "",
            code: "",
        });
    };

    const handleInput = (e) => setCreds({...creds, [e.target.name]: e.target.value});

    const handleEnter = (e) => {
        if (e.code === "Enter") {
            handleSignup(e);
        };
    };

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="card">
                <h1 className="card-header text-center">Sign Up</h1>
                <form className="m-2" onSubmit={handleSignup} onKeyPress={handleEnter}>
                    <div className="mb-3 ms-5 me-5">
                        <label htmlFor="username" className="form-label mb-0">Username:</label>
                        <input type="text"className="form-control" name="username" value={creds.username} onChange={handleInput} required/>
                    </div>
                    <div className="mb-3 ms-5 me-5">
                        <label htmlFor="password" className="form-label mb-0">Password:</label>
                        <input type="password" className="form-control" name="password" value={creds.password} onChange={handleInput} required/>
                    </div>
                    <div className="mb-3 ms-5 me-5">
                        <label htmlFor="code" className="form-label mb-0">Code:</label>
                        <input type="password" className="form-control" name="code" value={creds.code} onChange={handleInput} required/>
                    </div>
                    <div className="ms-5 me-5">
                        <input type="submit" className="btn btn-primary text-center" value="Create" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Signup;