
import React, {useState, createContext} from "react";


export const StateContext = createContext()

export const StateProvider = props => {

	const [commentCard, setCommentCard] = useState(false)

	return (
		<StateContext.Provider value={[commentCard, setCommentCard]}>
			{props.children}
		</StateContext.Provider>
	)
}