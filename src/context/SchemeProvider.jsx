"use client";

import { createContext, useState } from "react";

export const SchemeContext = createContext();

export const SchemeProvider = ({ children }) => {
  const [catagory, setCatagory] = useState({});
  const [isOpen, setIsOpen] = useState(false);
    const [selectedSchemes , setSelectedSchemes] = useState([]);
  return (
    <SchemeContext.Provider value={{ catagory, setCatagory , selectedSchemes , setSelectedSchemes , isOpen , setIsOpen}}>
      {children}
    </SchemeContext.Provider>
  );
};
