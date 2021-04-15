import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Card.jsx"
import Form from "./Form.jsx";

function Home({ user, showToast }) {
    const [trivia, setTrivia] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);
    
    const getQuestion = async () => {
        // make sure answer is not showing when moving to next question
        if (showAnswer) setShowAnswer(false);

        const result = await axios.get("/question");
        setTrivia(result.data);
    };

    const deleteQuestion = async () => {
        const result = await axios.delete("/question", {
            id: trivia.id,
        });

        showToast(result.data);
    }

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
                            del={deleteQuestion}
                        />
                    }
                    <Form user={user} toast={showToast}/>
                </div>
            </div>
        </div> 
    )
}

export default Home;