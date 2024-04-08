// StyleContext.js
import React, { createContext, useContext, useState } from 'react';

const StyleContext = createContext();

export const StyleProvider = ({ children }) => {
  const [styler, setStyles] = useState({
    fontSize: 14,
    fontFamily: 'Verdana',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
    
  });

  const updateStyles = (newStyles) => {
    setStyles((prevStyles) => ({ ...prevStyles, ...newStyles }));
  };

  return (
    <StyleContext.Provider value={{ styler, updateStyles }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
