import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card.jsx"
import Form from "./Form.jsx";

function Home({ auth }) {
    const [trivia, setTrivia] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [message, setMessage] = useState("");

    const getQuestion = async () => {
        const result = await axios.get("/get");
        setTrivia(result.data);
    };

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

    const handleFlipButton = () => {
        setShowAnswer(!showAnswer);
    };

    useEffect(() => {
        getQuestion();
    },[]);

    return (
        <div>
            <div className="card m-3 text-center bg-secondary">
                <h1 className="card-header text-white">Software Engineering Flash Cards</h1>
                <div className="card-body bg-light">
                    {
                        trivia === null ? 
                        "Loading..." : 
                        <Card 
                            trivia={trivia} 
                            showAnswer={showAnswer} 
                            handleFlip={handleFlipButton} 
                            next={getQuestion}
                        />
                    }
                    <Form auth={auth} toast={showToast}/>
                </div>
                
            </div>
            <div className="toast hide align-items-center position-absolute m-5 top-0 end-0 bg-white border-primary" role="alert" aria-live="assertive" aria-atomic="true">
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

export default Home;