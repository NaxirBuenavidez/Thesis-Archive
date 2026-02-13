import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    const startLoading = () => setIsLoading(true);
    const stopLoading = () => setIsLoading(false);

    React.useEffect(() => {
        const handleStart = () => startLoading();
        const handleStop = () => stopLoading();

        window.addEventListener('loading-start', handleStart);
        window.addEventListener('loading-stop', handleStop);

        return () => {
            window.removeEventListener('loading-start', handleStart);
            window.removeEventListener('loading-stop', handleStop);
        };
    }, []);

    return (
        <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
