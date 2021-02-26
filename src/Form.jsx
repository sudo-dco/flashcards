import React, { useState } from "react";
import axios from 'axios';

const Form = ({ toast, auth }) => {
    const [questionInput, setQuestionInput] = useState("");
    const [answerInput, setAnswerInput] = useState("");

    const addQuestion = (e) => {
        e.preventDefault();
        if (auth) {
            axios.post("/add", {
                question: questionInput,
                answer: answerInput
            });
    
            setQuestionInput("");
            setAnswerInput("");
    
            toast("Question Added!");
        } else {
            toast("Not Authorized")
        }
    };

    const handleInput = ({ target }) => {
        const { value } = target;

        if (target.name === "question") {
            setQuestionInput(value);
        } else if (target.name ="answer") {
            setAnswerInput(value);
        }
    };

    return (
        <form className="card border-primary" onSubmit={addQuestion}>
            <h5 className="card-header">Add New Question:</h5>
            <div className="card-body">
                <label className="form-label mb-0" htmlFor="question">Question:</label>
                <textarea
                    className="form-control mb-2"
                    name="question" 
                    value={questionInput} 
                    onChange={handleInput}
                    rows="5"
                    cols="35"
                />
                <label className="form-label mb-0" htmlFor="answer">Answer:</label>
                <textarea
                    className="form-control"
                    name="answer" 
                    value={answerInput} 
                    onChange={handleInput}
                    rows="5"
                    cols="35"
                />
                <button className="btn btn-primary mt-2" type="submit">Submit</button>
            </div>
        </form>
    )
};

export default Form;