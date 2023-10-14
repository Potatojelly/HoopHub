import React, { createContext, useContext, useState } from 'react';

const SelectedCardContext = createContext();

export const SelectedCardProvider = ({ children }) => {
    const [selectedCard, setSelectedCard] = useState(null);

    const selectCard = (idx) => {
        setSelectedCard(idx);
    };

    return (
        <SelectedCardContext.Provider value={{ selectedCard, selectCard }}>
            {children}
        </SelectedCardContext.Provider>
    );
};

export const useSelectedCard = () => {
    return useContext(SelectedCardContext);
};