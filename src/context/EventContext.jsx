// src/context/EventContext.jsx

import React, { createContext, useState } from 'react';


const EventContext = createContext();


const EventProvider = ({ children }) => {
    const [someContextValue, setSomeContextValue] = useState(''); // Example state

    return (
        <EventContext.Provider value={{ someContextValue, setSomeContextValue }}>
            {children}
        </EventContext.Provider>
    );
};

// Export default the EventProvider and EventContext
export default EventProvider;
export { EventContext };