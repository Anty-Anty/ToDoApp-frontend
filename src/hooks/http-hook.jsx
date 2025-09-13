import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setIsLoading(true);

        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            //data we send to API:
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            //data we get back from API:
            const responseData = await response.json();

            //removing abort controller from array of abort controllers
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (!response.ok) {
                throw new Error(responseData.message);
            };

            setIsLoading(false);
            return responseData;

        } catch (err) {

            //original catch(err)code:
            // setError(err.message);
            // setIsLoading(false);
            // throw err;

            // fix for "signal is aborted without reason" error
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if (err.name === "AbortError") {
                // silently ignore
                // console.log("Request aborted:", url);
            } else {
                setError(err.message);
                throw err;
            }
            setIsLoading(false);
        };



    }, []);

    const clearError = () => {
        setError(null);
    };

    // useEffect runs when components unmounts and cencel http request
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError };
};
