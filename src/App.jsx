import React, { useState, useEffect } from "react";
import {
    Switch,
    Route,
    useLocation,
    useHistory,
} from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";


function App() {
    const [user, setUser] = useState({
        name: null,
        isAuth: false,
    });
    const [message, setMessage] = useState("");

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (user.name === null && location.pathname === "/home") {
            history.push("/login");
        }
    })

    const changeAuth = (name, status) => {
        if (status === true) {
            setUser({
                ...user,
                name: name,
                isAuth: status,
            });
        }
    }

    const showToast = (msg) => {
        setMessage(`${msg}`);

        const option = {
            animation: true,
            autohide: true,
            delay: 2000
        };

        const toastElList = [].slice.call(document.querySelectorAll('.toast'))
        const toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl, option)
        })

        toastList[0].show();
    };

    return (
        <div className="h-100">
            <Switch>
                <Route path="/signup">
                    <Signup showToast={showToast} />
                </Route>
                <Route path="/home">
                    <Home user={user} showToast={showToast} />
                </Route>
                <Route path="/">
                    <Login changeAuth={changeAuth} />
                </Route>
            </Switch>
            <div className="toast hide align-items-center position-absolute m-4 top-0 end-0 bg-white border-primary" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body">
                        {message}
                    </div>
                    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        </div> 
    )
}

export default App;