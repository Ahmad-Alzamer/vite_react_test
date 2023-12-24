import {Action} from "./actions/types.ts";
import React, {useContext} from "react";

export type State={

}

export const initialState:State={
}




export function reducer(draft:State, action: Action) {
    switch (action.type) {
        case "RESET":
            return initialState;
        default: return  draft;
    }
}

interface StateContext{
    state: State,
    dispatch: React.Dispatch<Action>
}
export const StateContext = React.createContext<StateContext>({} as any);
export function useStateContext(){
    return useContext<StateContext>(StateContext);
}