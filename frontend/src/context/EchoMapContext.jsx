import { createContext, useContext } from "react";
import useEchoMapSocket from "../hooks/useEchoMapSocket";

const EchoMapContext = createContext(null);

export function EchoMapProvider({ children }) {
  const socket = useEchoMapSocket();

  return (
    <EchoMapContext.Provider value={socket}>
      {children}
    </EchoMapContext.Provider>
  );
}

export function useEchoMap() {
  const context = useContext(EchoMapContext);

  if (!context) {
    throw new Error("useEchoMap must be used inside EchoMapProvider");
  }

  return context;
}