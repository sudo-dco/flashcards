import React, { useState } from "react";
import {
    Switch,
    Route
} from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";


function App() {
    const [isAuth, setIsAuth] = useState(false);

    const changeAuth = (value) => {
        if (value === true) {
            setIsAuth(true);
        }
    }

    return (
            <Switch>
                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/home">
                    <Home auth={isAuth} />
                </Route>
                <Route path="/">
                    <Login changeAuth={changeAuth} />
                </Route>
            </Switch>
    )
}

export default App;