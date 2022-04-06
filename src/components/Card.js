import React, { useContext } from "react";
import { StateContext } from "../context/Context";
import "./Card.css";

export default function Card() {
    const [card, setCard, addComment, setAddComment, validation, setValidation] = useContext(StateContext);

    const handleCard = () => {
        setCard(!card);
    };

    const handleInput = (e) => {
     
        setAddComment(e.target.value);
    };

    const handleForm = (e) => {
        e.preventDefault();
		  setCard(!card)
		  setValidation(true)
    };

    return (
        <div className="containerCard">
            <div onClick={handleCard} className="overlay"></div>
            <form className="card" onSubmit={handleForm}>
                <input
                    onChange={(e) => handleInput(e)}
                    type="text"
                    placeholder="Your comment"
                />
                <button>Valider</button>
            </form>
        </div>
    );
}
