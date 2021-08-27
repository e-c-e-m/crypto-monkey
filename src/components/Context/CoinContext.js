import React from "react";

const CoinContext = React.createContext();




function CoinContextProvider({ children }) {
  return (
    <CoinContext.Provider>
      {children}
    </CoinContext.Provider>
  )
}

export { CoinContextProvider };
