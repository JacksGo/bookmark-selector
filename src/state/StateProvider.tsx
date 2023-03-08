import { useReducer } from "react";
import { reducer, StateContext, useStateProvider } from "./reducer";
import { initialState } from "./store";

interface Props {
  children: React.ReactNode,
}

const StateProvider = ({children}: Props) => {
  const [ state, dispatch ] = useStateProvider();

  return (
    <StateContext.Provider value={[state, dispatch]}>
      {children}
    </StateContext.Provider>
  )
}

export default StateProvider;