import React, { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
    const [card, setCard] = useState(false);
    const [validation, setValidation] = useState(false)
    const [addComment, setAddComment] = useState("");

    return (
        <StateContext.Provider
            value={[card, setCard, addComment, setAddComment, validation, setValidation]}
        >
            {props.children}
        </StateContext.Provider>
    );
};
