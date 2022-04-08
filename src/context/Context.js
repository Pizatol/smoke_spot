import React, { useState, createContext } from "react";

export const StateContext = createContext();

export const StateProvider = (props) => {
    const [card, setCard] = useState(false);
    const [positionMarker, setpositionMarker] = useState("")
    const [addComment, setAddComment] = useState("");


    return (
        <StateContext.Provider
            value={[card, setCard, addComment, setAddComment, positionMarker, setpositionMarker]}
        >
            {props.children}
        </StateContext.Provider>
    );
};

