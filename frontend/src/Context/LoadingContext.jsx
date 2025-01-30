// LoadingContext.jsx
import React, { createContext, useContext, useState } from "react";

// Create a context
export const LoadingContext = createContext();

// Create a custom hook to use the LoadingContext
export const useLoading = () => {
  return useContext(LoadingContext);
};

// Create a provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
