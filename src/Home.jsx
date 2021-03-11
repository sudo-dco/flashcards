import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card.jsx"
import Form from "./Form.jsx";

function Home({ user, showToast }) {
    const [trivia, setTrivia] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    

    const getQuestion = async () => {
        const result = await axios.get(`/get/${user.name}`);
        setTrivia(result.data);
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
                    <p className="fs-6">Logged in as: {user.name}</p>
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
                    <Form user={user} toast={showToast}/>
                </div>
            </div>
        </div> 
    )
}

export default Home;