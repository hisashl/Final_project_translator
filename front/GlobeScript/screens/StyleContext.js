// // StyleContext.js
// import React, { createContext, useContext, useState } from 'react';

// const StyleContext = createContext();

// export const StyleProvider = ({ children }) => {
//   const [styler, setStyles] = useState({
//     fontSize: 14,
//     fontFamily: 'Verdana',
//     textColor: '#000000',
//     backgroundColor: '#FFFFFF',
    
//   });

//   const updateStyles = (newStyles) => {
//     setStyles((prevStyles) => ({ ...prevStyles, ...newStyles }));
//   };

//   return (
//     <StyleContext.Provider value={{ styler, updateStyles }}>
//       {children}
//     </StyleContext.Provider>
//   );
// };

// export const useStyle = () => useContext(StyleContext);
// StyleContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyleContext = createContext();

export const StyleProvider = ({ children }) => {
  const [styler, setStyles] = useState({
    fontSize: 14,
    fontFamily: 'Verdana',
    textColor: '#000000',
    backgroundColor: '#FFFFFF',
  });
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme !== null) {
          setTheme(savedTheme);
        }
      } catch (error) {
       // console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, []);

  const updateStyles = (newStyles) => {
    setStyles((prevStyles) => ({ ...prevStyles, ...newStyles }));
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      //console.error('Error saving theme:', error);
    }
  };

  return (
    <StyleContext.Provider value={{ styler, updateStyles, theme, toggleTheme }}>
      {children}
    </StyleContext.Provider>
  );
};

export const useStyle = () => useContext(StyleContext);
