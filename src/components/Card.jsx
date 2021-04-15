import React from "react";

const Card = ({trivia, showAnswer, handleFlip, next, del}) => {
    return (
        <div className="card mb-3 border-primary">
            <h5 className="card-header">{showAnswer ? "Answer" : "Question"}</h5>
            <div className="card-body">
                <p className="card-text">{showAnswer && trivia !== null ? trivia.answer : trivia.question}</p>
                <button className="btn btn-primary me-2" onClick={handleFlip}>Flip Card</button>
                <button className="btn btn-primary me-2" onClick={next}>Next Card</button>
                <button className="btn btn-primary" onClick={del}>Delete</button>

            </div>
        </div>
    )
}

export default Card;